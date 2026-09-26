/**
 * Adapts registry source files for a consumer project. Relative imports keep
 * working because the folder layout (components/, lib/, provider/) is
 * preserved; `.js` extensions are stripped unless configured otherwise.
 */
export function transformSource(
  content: string,
  { importExtensions }: { importExtensions: boolean },
): string {
  if (importExtensions) return content;
  return content.replace(/(from\s+["']|import\(\s*["'])(\.{1,2}\/[^"']+?)\.js(["'])/g, "$1$2$3");
}

export function hash(content: string): string {
  let h = 2166136261;
  for (let i = 0; i < content.length; i++) {
    h ^= content.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
