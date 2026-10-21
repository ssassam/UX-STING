import { jsonLd } from "./builders.js";
import type { JsonLdDocument, SchemaNode } from "./types.js";

const toDocument = (input: JsonLdDocument | SchemaNode | SchemaNode[]): JsonLdDocument =>
  !Array.isArray(input) && "@context" in input
    ? (input as JsonLdDocument)
    : jsonLd(input as SchemaNode | SchemaNode[]);

/**
 * Serializes JSON-LD for an inline `<script type="application/ld+json">`.
 * Escapes `<`, `>`, `&` and the U+2028/U+2029 separators so values such as
 * `</script>` in a product name cannot break out of the script element.
 */
export function serializeJsonLd(input: JsonLdDocument | SchemaNode | SchemaNode[]): string {
  return JSON.stringify(toDocument(input))
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Props for a React `<script>` element, rendered on the server:
 * `<script {...jsonLdScriptProps(nodes)} />`.
 */
export function jsonLdScriptProps(input: JsonLdDocument | SchemaNode | SchemaNode[]) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: serializeJsonLd(input) },
  };
}

/** The full `<script>` tag as an HTML string, for non-React templates. */
export function jsonLdScriptTag(input: JsonLdDocument | SchemaNode | SchemaNode[]): string {
  return `<script type="application/ld+json">${serializeJsonLd(input)}</script>`;
}
