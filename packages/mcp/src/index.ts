import { realpath } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import {
  PRESET_NAMES,
  presets,
  themeToCss,
  themeToDesignMd,
  importDesignMd,
} from "@ux-sting/themes";
import { planSite, generateNextApp } from "@ux-sting/universal";
import { validateDna } from "@ux-sting/design-dna";
import { extractUrl } from "@ux-sting/extract";
import { runQa } from "@ux-sting/qa";
import { comparePngFiles } from "@ux-sting/vision";

const text = z.string().max(20_000);
const id = z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,79}$/);
const role = z.enum([
  "navigation",
  "hero",
  "intro",
  "features",
  "list",
  "gallery",
  "stats",
  "testimonials",
  "pricing",
  "menu",
  "schedule",
  "faq",
  "cta",
  "contact",
  "content",
  "footer",
]);
export const briefSchema = z.object({
  name: text.min(1),
  industry: text.min(1),
  audience: text.min(1),
  goals: z.array(text).min(1).max(30),
  tone: z.array(text).max(30),
  language: z.string().min(2).max(35),
  dir: z.enum(["ltr", "rtl"]).optional(),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  density: z.enum(["airy", "balanced", "dense"]).optional(),
  avoid: z.array(text).max(30).optional(),
  sections: z
    .array(
      z.object({
        id,
        role,
        items: z.number().int().min(0).max(100).optional(),
        media: z.boolean().optional(),
      }),
    )
    .min(1)
    .max(50),
});
const link = z.object({ label: text, href: z.string().max(2048) });
const contentSchema = z.object({
  lang: z.string().min(2).max(35),
  dir: z.enum(["ltr", "rtl"]).optional(),
  title: text,
  description: text,
  siteName: text,
  nav: z.array(link).max(30),
  footer: text.optional(),
  sections: z
    .array(
      z.object({
        id,
        eyebrow: text.optional(),
        heading: text.optional(),
        body: text.optional(),
        action: link.optional(),
        media: z.object({ alt: text }).optional(),
        items: z
          .array(z.object({ title: text, text: text.optional(), meta: text.optional() }))
          .max(100)
          .optional(),
      }),
    )
    .min(1)
    .max(50),
});
const namedTheme = z.object({
  name: z.enum(PRESET_NAMES as [(typeof PRESET_NAMES)[number], ...(typeof PRESET_NAMES)[number][]]),
});
const targetSchema = z.object({
  url: z.url().refine((value) => /^https?:/.test(value), "HTTP(S) required"),
  allowHosts: z.array(z.string().max(255)).max(20).optional(),
});
const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const response = async (fn: () => unknown) => {
  try {
    return { content: [{ type: "text" as const, text: JSON.stringify(await fn(), null, 2) }] };
  } catch (error) {
    return {
      isError: true,
      content: [
        { type: "text" as const, text: error instanceof Error ? error.message : String(error) },
      ],
    };
  }
};

/** Each invocation has an isolated server. No writes, shell execution, or installation tools. */
export function createServer(options: { rootDir?: string } = {}): McpServer {
  const server = new McpServer({ name: "ux-sting", version: "0.6.2" });
  server.registerTool(
    "list_themes",
    { description: "List the 17 UX-STING theme presets.", inputSchema: z.object({}), annotations },
    async () => response(() => PRESET_NAMES),
  );
  server.registerTool(
    "get_theme",
    {
      description: "Get resolved semantic tokens and CSS for a theme.",
      inputSchema: namedTheme,
      annotations,
    },
    async ({ name }) => response(() => ({ theme: presets[name], css: themeToCss(presets[name]) })),
  );
  server.registerTool(
    "export_design_md",
    {
      description: "Export a preset as DESIGN.md with YAML tokens and design rationale.",
      inputSchema: namedTheme,
      annotations,
    },
    async ({ name }) => response(() => ({ markdown: themeToDesignMd(presets[name]) })),
  );
  server.registerTool(
    "import_design_md",
    {
      description: "Import DESIGN.md and report defaults or unsupported tokens.",
      inputSchema: z.object({ markdown: z.string().max(1_000_000) }),
      annotations,
    },
    async ({ markdown }) => response(() => importDesignMd(markdown)),
  );
  server.registerTool(
    "plan_design",
    {
      description:
        "Reason about a brief before coding: return three scored directions, rationale, risks and selected DNA.",
      inputSchema: z.object({ brief: briefSchema, directionId: z.string().optional() }),
      annotations,
    },
    async ({ brief, directionId }) => response(() => planSite(brief, directionId)),
  );
  server.registerTool(
    "validate_design",
    {
      description:
        "Validate the planned design's contrast, typography and layout constraints before code generation.",
      inputSchema: z.object({ brief: briefSchema, directionId: z.string().optional() }),
      annotations,
    },
    async ({ brief, directionId }) => response(() => validateDna(planSite(brief, directionId).dna)),
  );
  server.registerTool(
    "generate_app",
    {
      description:
        "Generate reviewable Next.js App Router files for a multi-page brief. Returns files without writing them.",
      inputSchema: z.object({
        brief: briefSchema,
        directionId: z.string().optional(),
        pages: z
          .array(z.object({ path: z.string().max(250), content: contentSchema }))
          .min(1)
          .max(30),
      }),
      annotations,
    },
    async ({ brief, directionId, pages }) =>
      response(() => {
        const plan = planSite(brief, directionId);
        return { plan, files: generateNextApp({ name: brief.name, dna: plan.dna, pages }) };
      }),
  );
  server.registerTool(
    "extract_tokens",
    {
      description:
        "Measure an operator-selected URL in Chromium and return design tokens with provenance.",
      inputSchema: targetSchema,
      annotations: { ...annotations, openWorldHint: true },
    },
    async ({ url, allowHosts }) => response(() => extractUrl(url, { allowHosts })),
  );
  server.registerTool(
    "audit_page",
    {
      description:
        "Run Chromium accessibility, layout, performance and taste QA. No report files are written.",
      inputSchema: targetSchema,
      annotations: { ...annotations, openWorldHint: true },
    },
    async ({ url, allowHosts }) => response(() => runQa(url, { allowHosts, screenshots: false })),
  );
  server.registerTool(
    "compare_screenshots",
    {
      description:
        "Compare two PNG screenshots within the configured workspace; return mismatch, SSIM and bands.",
      inputSchema: z.object({ reference: z.string().max(2048), candidate: z.string().max(2048) }),
      annotations,
    },
    async ({ reference, candidate }) =>
      response(async () => {
        const root = await realpath(options.rootDir ?? process.cwd());
        const scoped = async (path: string) => {
          const file = await realpath(resolve(root, path));
          if (!file.startsWith(root + sep))
            throw new Error("Screenshot path must be inside the configured workspace.");
          return file;
        };
        return comparePngFiles(await scoped(reference), await scoped(candidate));
      }),
  );
  return server;
}
