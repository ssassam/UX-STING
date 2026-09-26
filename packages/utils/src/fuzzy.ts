/**
 * Small fuzzy matcher for command palettes. Returns a score in (0, 1]; 0 means
 * no match. Consecutive characters, word starts and prefixes score higher.
 */
export function fuzzyScore(query: string, text: string, keywords: readonly string[] = []): number {
  const q = normalize(query);
  if (!q) return 1;
  const haystacks = [text, ...keywords].map(normalize);
  let best = 0;
  for (const h of haystacks) best = Math.max(best, scoreOne(q, h));
  return best;
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function scoreOne(q: string, h: string): number {
  if (!h) return 0;
  if (h === q) return 1;
  if (h.startsWith(q)) return 0.95;
  const idx = h.indexOf(q);
  if (idx > -1) return h[idx - 1] === " " ? 0.9 : 0.8;

  let score = 0;
  let hi = 0;
  let consecutive = 0;
  for (const ch of q) {
    const found = h.indexOf(ch, hi);
    if (found === -1) return 0;
    consecutive = found === hi ? consecutive + 1 : 0;
    const wordStart = found === 0 || h[found - 1] === " " || h[found - 1] === "-";
    score += 1 + consecutive * 0.5 + (wordStart ? 0.75 : 0);
    hi = found + 1;
  }
  const max = q.length * 2.25;
  return Math.min(0.75, (score / max) * 0.75);
}
