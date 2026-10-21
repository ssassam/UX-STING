export interface ExtractedBlock {
  /** Zero-based order of the block in the document. */
  index: number;
  /** Parsed JSON, when the block is valid JSON. */
  data?: unknown;
  /** Parse error message, when it is not. */
  error?: string;
  /** Raw text of the block (trimmed, truncated to 2,000 characters). */
  raw: string;
}

/** Default cap on the HTML size scanned, to keep extraction bounded. */
export const MAX_HTML_BYTES = 5_000_000;

const LD_TYPE = /\btype\s*=\s*(["']?)application\/ld\+json\1/i;

/**
 * Extracts every `<script type="application/ld+json">` block from an HTML
 * string and parses it. Invalid JSON is reported, not thrown. Only the first
 * `maxBytes` characters are scanned.
 */
export function extractJsonLd(html: string, { maxBytes = MAX_HTML_BYTES } = {}): ExtractedBlock[] {
  const source = html.length > maxBytes ? html.slice(0, maxBytes) : html;
  // ASCII-only lowercasing keeps indices aligned with `source` (toLowerCase can change length).
  const lower = source.replace(/[A-Z]+/g, (m) => m.toLowerCase());
  const blocks: ExtractedBlock[] = [];
  // A linear scan with indexOf: no backtracking, so hostile input stays O(n).
  let from = 0;
  while (from < lower.length) {
    const open = lower.indexOf("<script", from);
    if (open === -1) break;
    const after = lower.charCodeAt(open + 7);
    const tagEnd = lower.indexOf(">", open);
    if (tagEnd === -1) break;
    const close = lower.indexOf("</script", tagEnd);
    if (close === -1) break;
    from = close + 8;
    // "<scripts" or "<script-x" are other elements.
    if (!(after === 62 || after === 47 || after <= 32)) continue;
    if (!LD_TYPE.test(source.slice(open + 7, tagEnd))) continue;
    const text = source.slice(tagEnd + 1, close).trim();
    const block: ExtractedBlock = { index: blocks.length, raw: text.slice(0, 2000) };
    try {
      block.data = JSON.parse(text);
    } catch (error) {
      block.error = error instanceof Error ? error.message : String(error);
    }
    blocks.push(block);
  }
  return blocks;
}
