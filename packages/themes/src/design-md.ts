import { parse, stringify } from "yaml";
import { createTheme, type ResolvedTheme, type ThemeConfig } from "./theme.js";
import type { SemanticColors } from "@ux-sting/tokens";

const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const stringMap = (value: unknown): value is Record<string, string> =>
  object(value) && Object.values(value).every((v) => typeof v === "string");

/** YAML tokens follow google-labs-code/design.md; uxSting preserves all modes losslessly. */
export function themeToDesignMd(theme: ResolvedTheme): string {
  const tokens = {
    name: theme.name,
    colors: {
      primary: theme.light.primary,
      secondary: theme.light["muted-foreground"],
      neutral: theme.light.background,
      foreground: theme.light.foreground,
    },
    typography: {
      "body-md": {
        fontFamily: theme.vars["--ui-font-sans"] ?? "system-ui, sans-serif",
        fontSize: "1rem",
      },
    },
    rounded: { md: theme.vars["--ui-radius"] ?? "0.5rem" },
    spacing: { sm: "8px", md: "16px", lg: "32px" },
    uxSting: {
      version: 1,
      light: theme.light,
      dark: theme.dark,
      highContrast: theme.highContrast,
      vars: theme.vars,
    },
  };
  return `---\n${stringify(tokens)}---\n\n# ${theme.name}\n\n## Overview\n\nUX-STING theme with semantic colors for light, dark, and high contrast modes.\nUse the tokens consistently; avoid introducing unrelated accent colors.\n\n## Components\n\nUse primary for actions and foreground for text. Pair each surface with its matching foreground.\nKeep visible focus rings and readable text at 200% zoom.\n\n## Motion\n\nUse brief transitions for state changes. Respect prefers-reduced-motion.\n`;
}

export interface DesignMdImport {
  theme: ResolvedTheme;
  warnings: string[];
}
/** Imports YAML-frontmatter DESIGN.md, returning explicit warnings for unrepresented tokens. */
export function importDesignMd(markdown: string): DesignMdImport {
  if (markdown.length > 1_000_000) throw new Error("DESIGN.md exceeds 1 MB.");
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) throw new Error("Expected DESIGN.md YAML frontmatter.");
  const doc: unknown = parse(match[1]!, { maxAliasCount: 20 });
  if (
    !object(doc) ||
    typeof doc.name !== "string" ||
    !/^[a-zA-Z0-9][a-zA-Z0-9 _-]{0,79}$/.test(doc.name)
  )
    throw new Error("Expected a safe theme name (1–80 characters).");
  const ext = doc.uxSting;
  if (object(ext)) {
    if (ext.version !== 1) throw new Error("Unsupported uxSting DESIGN.md version.");
    const defaults = createTheme({ name: doc.name });
    for (const mode of ["light", "dark", "highContrast"] as const) {
      const values = ext[mode];
      if (!stringMap(values) || Object.keys(defaults[mode]).some((key) => !(key in values)))
        throw new Error(`Incomplete ${mode} semantic colors.`);
    }
    if (!stringMap(ext.vars) || Object.keys(ext.vars).some((key) => !key.startsWith("--ui-")))
      throw new Error("Invalid theme variables.");
    return {
      theme: {
        name: doc.name,
        light: ext.light as SemanticColors,
        dark: ext.dark as SemanticColors,
        highContrast: ext.highContrast as SemanticColors,
        vars: ext.vars,
      },
      warnings: [],
    };
  }
  const colors = doc.colors;
  if (!stringMap(colors) || !colors.primary)
    throw new Error("Expected colors.primary in DESIGN.md.");
  const light: Partial<SemanticColors> = { primary: colors.primary };
  if (colors.neutral) light.background = colors.neutral;
  if (colors.foreground) light.foreground = colors.foreground;
  const config: ThemeConfig = { name: doc.name, colors: { light } };
  const typography = doc.typography;
  if (
    object(typography) &&
    object(typography["body-md"]) &&
    typeof typography["body-md"].fontFamily === "string"
  )
    config.fontFamily = { sans: typography["body-md"].fontFamily };
  if (object(doc.rounded) && typeof doc.rounded.md === "string") config.radius = doc.rounded.md;
  return {
    theme: createTheme(config),
    warnings: [
      "Imported primary, neutral, foreground, body font and md radius where present. Other tokens remain in the source document.",
      "Dark, high contrast, and unrepresented semantic roles use UX-STING defaults; audit contrast before use.",
    ],
  };
}
