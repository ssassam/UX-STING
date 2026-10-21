import { ensureContrast } from "./color.js";
import type { DesignDNA } from "./types.js";

export type DnaFacet =
  "color" | "typography" | "layout" | "shape" | "imagery" | "motion" | "navigation";

/**
 * Style transfer: starts from `base` and takes whole facets from donors,
 * e.g. the typography of one reference and the palette of another. Sections
 * stay with `base` unless "layout" is taken, so the content structure of the
 * new project is preserved. Contrast is re-checked after mixing, because
 * colors from one site can fail on another site's surfaces.
 */
export function remixDna(
  base: DesignDNA,
  donors: Array<{ dna: DesignDNA; take: DnaFacet[] }>,
  name = `${base.name} (remix)`,
): DesignDNA {
  const next = structuredClone(base);
  next.name = name;
  next.mode = "remix";
  for (const { dna, take } of donors) {
    for (const facet of take) {
      const value = structuredClone(dna[facet]);
      if (facet === "layout")
        (next.layout as DesignDNA["layout"]) = {
          ...(value as DesignDNA["layout"]),
          sections: base.layout.sections,
        };
      else (next as unknown as Record<string, unknown>)[facet] = value;
      next.provenance[facet] = {
        source: "remix",
        confidence: 0.8,
        evidence: `taken from "${dna.name}"`,
      };
    }
    next.sources.push(...dna.sources);
  }
  const c = next.color;
  c.foreground = ensureContrast(c.foreground, c.background);
  c.muted = ensureContrast(c.muted, c.background);
  c.accentForeground = ensureContrast(c.accentForeground, c.accent);
  return next;
}
