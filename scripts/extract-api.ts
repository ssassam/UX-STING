/**
 * Extracts component prop tables from the TypeScript sources of
 * @ux-sting/react using the compiler API. Output: registry/api.json.
 *
 * Only props declared by ux-sting (or the Radix primitive a component
 * wraps) are listed — inherited HTML attributes are summarised instead.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { components } from "../registry/components.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "packages/react/src");

interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description?: string;
}

interface ExportDoc {
  description?: string;
  kind: "component" | "function" | "constant";
  props: PropDoc[];
  inherits?: string;
}

const configPath = join(root, "packages/react/tsconfig.build.json");
const config = ts.getParsedCommandLineOfConfigFile(
  configPath,
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
)!;
const program = ts.createProgram({
  rootNames: config.fileNames,
  options: { ...config.options, noEmit: true },
});
const checker = program.getTypeChecker();

const isOwned = (file: string) =>
  (file.includes("/packages/") && !file.includes("node_modules")) || file.includes("@radix-ui");

function findImplementation(decl: ts.Declaration): ts.FunctionLikeDeclaration | undefined {
  if (ts.isFunctionDeclaration(decl)) return decl;
  if (ts.isVariableDeclaration(decl) && decl.initializer) {
    let init: ts.Expression = decl.initializer;
    while (ts.isAsExpression(init) || ts.isParenthesizedExpression(init)) init = init.expression;
    if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) return init;
    if (ts.isCallExpression(init)) {
      const fn = init.arguments.find((a) => ts.isFunctionExpression(a) || ts.isArrowFunction(a));
      if (fn) return fn as ts.FunctionLikeDeclaration;
    }
  }
  return undefined;
}

function defaultsOf(fn: ts.FunctionLikeDeclaration | undefined): Map<string, string> {
  const map = new Map<string, string>();
  const param = fn?.parameters[0];
  if (param && ts.isObjectBindingPattern(param.name)) {
    for (const el of param.name.elements) {
      const key = el.propertyName?.getText() ?? el.name.getText();
      if (el.initializer) map.set(key.replace(/^"|"$/g, ""), el.initializer.getText());
    }
  }
  return map;
}

function docOf(symbol: ts.Symbol): string | undefined {
  const text = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  return text || undefined;
}

function propsTypeOf(type: ts.Type): ts.Type | undefined {
  const sig = type.getCallSignatures()[0];
  const param = sig?.getParameters()[0];
  if (!param) return undefined;
  return checker.getTypeOfSymbol(param);
}

function describeExport(symbol: ts.Symbol): ExportDoc | undefined {
  const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
  const decl = resolved.valueDeclaration ?? resolved.declarations?.[0];
  if (!decl || !(resolved.flags & (ts.SymbolFlags.Variable | ts.SymbolFlags.Function)))
    return undefined;
  const type = checker.getTypeOfSymbolAtLocation(resolved, decl);
  const name = symbol.getName();
  const isComponent = /^[A-Z]/.test(name) && type.getCallSignatures().length > 0;
  if (!isComponent) {
    return {
      kind: type.getCallSignatures().length ? "function" : "constant",
      description: docOf(resolved),
      props: [],
    };
  }
  const propsType = propsTypeOf(type);
  const defaults = defaultsOf(findImplementation(decl));
  const props: PropDoc[] = [];
  let inherited = 0;
  for (const prop of propsType?.getProperties() ?? []) {
    const pdecl = prop.declarations?.[0];
    const file = pdecl?.getSourceFile().fileName ?? "";
    if (!isOwned(file)) {
      inherited++;
      continue;
    }
    if (prop.getName().startsWith("__")) continue;
    const ptype = checker.getTypeOfSymbolAtLocation(prop, pdecl!);
    const annotated =
      pdecl && (ts.isPropertySignature(pdecl) || ts.isPropertyDeclaration(pdecl)) && pdecl.type
        ? pdecl.type.getText().replace(/\s+/g, " ")
        : undefined;
    props.push({
      name: prop.getName(),
      type: (
        annotated ??
        checker.typeToString(
          checker.getNonNullableType(ptype),
          pdecl,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
        )
      )
        .replace(/ \| undefined$/, "")
        .slice(0, 220),
      required: !(prop.flags & ts.SymbolFlags.Optional),
      default: defaults.get(prop.getName()),
      description: docOf(prop),
    });
  }
  props.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
  return {
    kind: "component",
    description: docOf(resolved),
    props,
    inherits: inherited
      ? `${inherited} standard HTML/React attributes (className, style, aria-*, event handlers…)`
      : undefined,
  };
}

const out: Record<string, Record<string, ExportDoc>> = {};
for (const meta of components) {
  const file = program.getSourceFile(join(srcDir, "components", meta.name, "index.ts"));
  if (!file) {
    console.warn(`missing index for ${meta.name}`);
    continue;
  }
  const moduleSymbol = checker.getSymbolAtLocation(file);
  const exports = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
  const docs: Record<string, ExportDoc> = {};
  for (const exp of exports) {
    const doc = describeExport(exp);
    if (doc) docs[exp.getName()] = doc;
  }
  out[meta.name] = docs;
}

writeFileSync(join(root, "registry/api.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`API extracted for ${Object.keys(out).length} components.`);
