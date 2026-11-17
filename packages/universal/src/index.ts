import { mkdir, writeFile, lstat, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import {
  dnaFromDirection,
  generatePage,
  planDirections,
  validateDna,
  type Brief,
  type DesignDNA,
  type DesignDirection,
  type PageContent,
} from "@ux-sting/design-dna";
import { runQa, type QaOptions, type QaReport } from "@ux-sting/qa";

export interface SitePage {
  path: string;
  content: PageContent;
  dna?: DesignDNA;
}
export interface SiteSpec {
  name: string;
  dna: DesignDNA;
  pages: SitePage[];
}
export interface PlannedSite {
  directions: DesignDirection[];
  selected: DesignDirection;
  dna: DesignDNA;
  issues: ReturnType<typeof validateDna>;
}

/** Deterministic reasoning stage. Direction selection can be supplied by an agent or user. */
export function planSite(brief: Brief, directionId?: string): PlannedSite {
  const directions = planDirections(brief);
  const selected = directionId ? directions.find((d) => d.id === directionId) : directions[0];
  if (!selected) throw new Error("Unknown design direction.");
  const dna = dnaFromDirection(brief, selected);
  return { directions, selected, dna, issues: validateDna(dna) };
}

function routePath(path: string): string {
  if (path === "/") return "app/page.tsx";
  if (!/^\/(?:[a-z0-9][a-z0-9-]*)(?:\/[a-z0-9][a-z0-9-]*)*$/.test(path))
    throw new Error(`Invalid static route: ${path}`);
  return `app${path}/page.tsx`;
}
const json = (value: unknown) => JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
const href = (value: string) => (/^(#|\/(?!\/)|\.\/|https?:\/\/)/.test(value) ? value : "#");

/** Pure generation: returns reviewable files without writing or installing anything. */
export function generateNextApp(spec: SiteSpec): Record<string, string> {
  if (!spec.pages.length || !spec.pages.some((p) => p.path === "/"))
    throw new Error("A site needs a home page at /.");
  const routes = spec.pages.map((page) => routePath(page.path));
  if (new Set(routes).size !== routes.length) throw new Error("Duplicate routes.");
  const errors = validateDna(spec.dna).filter((issue) => issue.severity === "error");
  if (errors.length) throw new Error(`Invalid design: ${errors.map((e) => e.message).join(" ")}`);
  const home = spec.pages.find((p) => p.path === "/")!.content;
  const files: Record<string, string> = {
    "package.json": json({
      name: spec.name.toLowerCase().replace(/[^a-z0-9-]/g, "-") || "ux-sting-site",
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        typecheck: "tsc --noEmit",
      },
      dependencies: { next: "^16.0.0", react: "^19.2.0", "react-dom": "^19.2.0" },
      devDependencies: {
        typescript: "~6.0.3",
        "@types/node": "^24.0.0",
        "@types/react": "^19.2.0",
        "@types/react-dom": "^19.2.0",
      },
    }),
    "tsconfig.json": json({
      compilerOptions: {
        target: "ES2022",
        lib: ["dom", "dom.iterable", "esnext"],
        strict: true,
        noEmit: true,
        module: "esnext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        esModuleInterop: true,
        resolveJsonModule: true,
        skipLibCheck: true,
        isolatedModules: true,
        plugins: [{ name: "next" }],
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    }),
    "next-env.d.ts":
      '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n',
    "next.config.mjs": 'export default { output: "export", trailingSlash: true };\n',
    ".gitignore": "node_modules\n.next\nout\n",
    "app/layout.tsx": `import type { ReactNode } from "react";\nimport "./globals.css";\nexport default function RootLayout({ children }: { children: ReactNode }) {\nreturn <html lang={${json(home.lang)}} dir={${json(home.dir ?? "ltr")}}><body>{children}</body></html>;\n}\n`,
    "design-plan.json": json({
      dna: spec.dna,
      issues: validateDna(spec.dna),
      routes: spec.pages.map((p) => p.path),
    }),
    "README.md":
      "# Generated with UX-STING\n\nRun `pnpm install`, then `pnpm dev`. Build with `pnpm build`.\nEach route is an editable React Server Component; design variables are in app/globals.css.\nMedia blocks are decorative placeholders. Connect real content and actions before release.\n",
  };
  // Reuse the proven HTML renderer's layout CSS, but emit native JSX for every route.
  const css = new Set<string>();
  for (const page of spec.pages) {
    const dna = page.dna ?? spec.dna;
    const pageErrors = validateDna(dna).filter((issue) => issue.severity === "error");
    if (pageErrors.length)
      throw new Error(
        `Invalid design for ${page.path}: ${pageErrors.map((e) => e.message).join(" ")}`,
      );
    const generated = generatePage(dna, page.content);
    // CSS is scoped to its route wrapper so page overrides do not leak across routes.
    const scope = `route-${spec.pages.indexOf(page)}`;
    css.add(
      `.${scope} {\n${generated.css.replace(/:root/g, "&").replace(/(^|\n)(html|body)(?=\s*\{)/g, "$1&")}\n}`,
    );
    const body = generated.html.match(/<body>([\s\S]*?)<\/body>/)?.[1];
    if (!body) throw new Error("Generated page has no body.");
    // The renderer emits a deliberately small static HTML vocabulary. Convert text and
    // attributes to JSX expressions so user text containing braces is never executable.
    const jsx = htmlToJsx(
      body.replace('<a class="brand" href="./">', '<a class="brand" href="/">'),
    );
    files[routePath(page.path)] =
      `import type { CSSProperties } from "react";\nexport const metadata = ${json({ title: page.content.title, description: page.content.description, authors: [{ name: "Veltein", url: "https://veltein.com/" }] })};\nexport default function Page() { return <div className="${scope}">${jsx}</div>; }\n`;
  }
  files["app/globals.css"] = `body { margin: 0; }\n${[...css].join("\n")}\n`;
  return files;
}

/** Converts only our renderer's escaped HTML; no arbitrary HTML input enters this API. */
function htmlToJsx(html: string): string {
  const decode = (value: string) =>
    value
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, ">")
      .replace(/&lt;/g, "<")
      .replace(/&amp;/g, "&");
  return html
    .split(/(<[^>]+>)/g)
    .map((part) => {
      if (!part.startsWith("<")) return part ? `{${json(decode(part))}}` : "";
      if (part.startsWith("</")) return part;
      const tag = /^<([a-z0-9-]+)/i.exec(part)?.[1];
      if (!tag) throw new Error("Unsupported generated markup.");
      const attrs: string[] = [];
      for (const m of part.matchAll(/([a-zA-Z][\w-]*)(?:="([^"]*)")?/g)) {
        if (m.index === 1) continue;
        let key = m[1]!;
        if (key === "class") key = "className";
        if (key === "tabindex") key = "tabIndex";
        if (key === "style") {
          const style = Object.fromEntries(
            decode(m[2] ?? "")
              .split(";")
              .filter(Boolean)
              .map((decl) => {
                const i = decl.indexOf(":");
                const rawKey = decl.slice(0, i).trim();
                const k = rawKey.startsWith("--")
                  ? rawKey
                  : rawKey.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
                return [k, decl.slice(i + 1).trim()];
              }),
          );
          attrs.push(`style={${json(style)} as CSSProperties}`);
        } else {
          let value = decode(m[2] ?? "");
          if (key === "href") value = href(value);
          attrs.push(`${key}={${key === "tabIndex" ? Number(value) : json(value)}}`);
        }
      }
      const close = ["br", "hr", "img", "input", "meta", "link", "source", "wbr"].includes(tag)
        ? " />"
        : ">";
      return `<${tag}${attrs.length ? " " + attrs.join(" ") : ""}${close}`;
    })
    .join("");
}

/** New directories only. Never overwrites an existing project or follows a destination symlink. */
export async function writeNextApp(spec: SiteSpec, outDir: string): Promise<string[]> {
  const files = generateNextApp(spec);
  const out = resolve(outDir);
  try {
    await lstat(out);
    throw new Error(`Destination already exists: ${out}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(dirname(out), { recursive: true });
  await mkdir(out);
  try {
    for (const [path, content] of Object.entries(files)) {
      const target = resolve(out, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content, { flag: "wx" });
    }
  } catch (error) {
    await rm(out, { recursive: true, force: true });
    throw error;
  }
  return Object.keys(files);
}

/** Audits each generated route through the existing browser QA engine. */
export async function verifySite(
  baseUrl: string,
  paths: string[],
  options: QaOptions = {},
): Promise<{ passed: boolean; pages: QaReport[] }> {
  const pages: QaReport[] = [];
  for (const path of paths) {
    routePath(path);
    pages.push(
      await runQa(new URL(path, baseUrl).href, {
        ...options,
        outDir: options.outDir
          ? resolve(options.outDir, path === "/" ? "home" : path.slice(1).replaceAll("/", "--"))
          : undefined,
      }),
    );
  }
  return { passed: pages.every((page) => page.passed), pages };
}
