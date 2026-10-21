import { dnaToCss } from "./tokens.js";
import type { DesignDNA, PageContent, SectionContent, SectionSpec } from "./types.js";

export interface GeneratedPage {
  html: string;
  css: string;
  /** Section ids in render order, for QA mapping. */
  sections: string[];
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Only same-document, relative or http(s) links are emitted. */
const safeHref = (href: string) => (/^(#|\/(?!\/)|\.\/|https?:\/\/)/.test(href) ? href : "#");

/**
 * Pairs content blocks with section specs: by id first, then by order for
 * whatever is left. Navigation and footer specs are rendered by the shell.
 */
function pair(
  dna: DesignDNA,
  content: PageContent,
): Array<{ spec: SectionSpec; block: SectionContent }> {
  const specs = dna.layout.sections.filter((s) => s.role !== "navigation" && s.role !== "footer");
  const byId = new Map(specs.map((s) => [s.id, s]));
  const unused = specs.filter((s) => !content.sections.some((b) => b.id === s.id));
  return content.sections.map((block) => {
    const spec = byId.get(block.id) ??
      unused.shift() ?? {
        id: block.id,
        role: "content",
        composition: "stack",
        columns: 1,
        surface: "background",
      };
    return { spec, block };
  });
}

/**
 * Renders a standalone, semantic, responsive HTML page from Design DNA and
 * content. Layout comes from each section's composition, not from a fixed
 * page template: the same content renders as an editorial index, a grid or
 * full-bleed bands depending on the DNA.
 */
export function generatePage(dna: DesignDNA, content: PageContent): GeneratedPage {
  const pairs = pair(dna, content);
  let h1Used = false;
  const sections = pairs.map(({ spec, block }) => {
    const level = !h1Used && block.heading ? 1 : 2;
    if (level === 1) h1Used = true;
    return renderSection(spec, block, level);
  });
  const css = `${dnaToCss(dna)}\n${baseCss(dna)}`;
  const nav = content.nav
    .map((l) => `<li><a href="${esc(safeHref(l.href))}">${esc(l.label)}</a></li>`)
    .join("");
  const html = `<!doctype html>
<html lang="${esc(content.lang)}" dir="${content.dir ?? "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.title)}</title>
<meta name="description" content="${esc(content.description)}">
<style>
${css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"${dna.navigation.sticky ? " data-sticky" : ""}>
<div class="wrap nav-row nav-row--${dna.navigation.pattern}">
<a class="brand" href="./">${esc(content.siteName)}</a>
${nav ? `<nav aria-label="Main"><ul>${nav}</ul></nav>` : ""}
</div>
</header>
<main id="main" tabindex="-1">
${sections.join("\n")}
</main>
<footer class="site-footer"><div class="wrap"><p>${esc(content.footer ?? `© ${content.siteName}`)}</p></div></footer>
</body>
</html>
`;
  return { html, css, sections: pairs.map((p) => p.spec.id) };
}

function renderSection(spec: SectionSpec, block: SectionContent, level: 1 | 2): string {
  const hid = `${spec.id}-h`;
  const heading = block.heading
    ? `<h${level} id="${esc(hid)}">${esc(block.heading)}</h${level}>`
    : "";
  const text = [
    block.eyebrow ? `<p class="eyebrow">${esc(block.eyebrow)}</p>` : "",
    heading,
    block.body ? `<p class="lede">${esc(block.body)}</p>` : "",
    block.action
      ? `<p><a class="action" href="${esc(safeHref(block.action.href))}">${esc(block.action.label)}</a></p>`
      : "",
  ].join("");
  const twoColumn = spec.composition === "split" || spec.composition === "asymmetric";
  // In grids and indexes the items carry the content; a media band would only add bulk.
  const listLayout = spec.composition === "grid" || spec.composition === "index";
  const media =
    block.media && !(listLayout && block.items?.length)
      ? `<div class="media" role="img" aria-label="${esc(block.media.alt)}"></div>`
      : twoColumn && !block.items?.length
        ? `<div class="media" aria-hidden="true"></div>`
        : "";
  const ordered = spec.composition === "index";
  const items = block.items?.length
    ? `<${ordered ? "ol" : "ul"} class="items" role="list">${block.items
        .map(
          (it) =>
            `<li><h${level + 1}>${esc(it.title)}</h${level + 1}>${it.text ? `<p>${esc(it.text)}</p>` : ""}${it.meta ? `<p class="meta">${esc(it.meta)}</p>` : ""}</li>`,
        )
        .join("")}</${ordered ? "ol" : "ul"}>`
    : "";
  const style = [
    `--cols:${Math.max(1, Math.min(4, spec.columns))}`,
    spec.paddingBlock ? `--pad:${Math.round(spec.paddingBlock)}px` : "",
  ]
    .filter(Boolean)
    .join(";");
  return `<section class="band band--${spec.surface}" id="${esc(spec.id)}"${heading ? ` aria-labelledby="${esc(hid)}"` : ""} data-role="${spec.role}" style="${style}">
<div class="wrap layout layout--${spec.composition}"><div class="text">${text}</div>${media}${items}</div>
</section>`;
}

function baseCss(dna: DesignDNA): string {
  const t = dna.typography;
  const hard = dna.shape.shadow === "hard";
  const shadow =
    dna.shape.shadow === "none"
      ? "none"
      : hard
        ? "4px 4px 0 0 var(--dna-fg)"
        : "0 8px 24px -12px rgb(0 0 0 / 0.25)";
  const aspect = dna.imagery.aspect && dna.imagery.aspect > 0 ? dna.imagery.aspect : 1.5;
  return `*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-padding-top:5rem}
body{margin:0;background:var(--dna-bg);color:var(--dna-fg);font-family:var(--dna-font-body);font-weight:var(--dna-weight-body);font-size:var(--dna-size-body);line-height:var(--dna-leading-body);overflow-wrap:break-word}
h1,h2,h3{color:var(--dna-heading);font-family:var(--dna-font-display);font-weight:var(--dna-weight-display);letter-spacing:var(--dna-tracking-heading);line-height:var(--dna-leading-heading);margin:0;text-wrap:balance}
h1{font-size:clamp(var(--dna-size-display-mobile), 7vw, var(--dna-size-display))}
h2{font-size:clamp(calc(var(--dna-size-h2) * 0.75), 4.5vw, var(--dna-size-h2))}
h3{font-size:var(--dna-size-h3);line-height:1.25}
p{margin:0}
a{color:inherit;text-underline-offset:.2em}
a:focus-visible,.action:focus-visible,main:focus-visible{outline:2px solid var(--dna-accent);outline-offset:3px}
main:focus{outline:none}
.skip{position:absolute;inset-inline-start:1rem;top:-4rem;background:var(--dna-accent);color:var(--dna-accent-fg);padding:.75rem 1rem;z-index:10}
.skip:focus{top:1rem}
.wrap{width:min(100% - 2 * clamp(16px, 4vw, var(--dna-page-padding)), var(--dna-container));margin-inline:auto}
.site-footer{padding-block:calc(var(--dna-unit) * 5);border-top:var(--dna-border-width) solid var(--dna-border);color:var(--dna-muted)}
.site-header{border-bottom:var(--dna-border-width) solid var(--dna-border);background:var(--dna-bg)}
.site-header[data-sticky]{position:sticky;top:0;z-index:5}
.nav-row{display:flex;align-items:center;justify-content:space-between;gap:var(--dna-gutter);min-height:4rem;flex-wrap:wrap}
.brand{font-family:var(--dna-font-display);font-weight:var(--dna-weight-display);font-size:1.25rem;text-decoration:none;letter-spacing:var(--dna-tracking-heading)}
nav ul{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem;list-style:none;margin:0;padding:0}
nav a{display:inline-flex;min-height:44px;align-items:center;text-decoration:none;color:var(--dna-muted)}
nav a:hover{color:var(--dna-fg)}
.band{padding-block:var(--pad, calc(var(--dna-section-gap) / 2))}
.band--surface{background:var(--dna-surface)}
.band--accent{background:var(--dna-accent);color:var(--dna-accent-fg)}
.band--inverse{background:var(--dna-inverse);color:var(--dna-inverse-fg)}
.band--inverse h1,.band--inverse h2,.band--inverse h3,.band--accent h1,.band--accent h2,.band--accent h3{color:inherit}
.band--inverse .lede,.band--inverse .meta,.band--inverse .eyebrow{color:inherit;opacity:.86}
.layout{display:grid;gap:calc(var(--dna-gutter) * 1.25)}
.text{display:grid;gap:calc(var(--dna-unit) * 2);align-content:start;max-width:var(--dna-measure)}
.layout--split .text,.layout--asymmetric .text,.layout--full-bleed .text{max-width:none}
.eyebrow,.meta{font-size:var(--dna-size-small);color:var(--dna-muted)${t.uppercaseLabels ? ";text-transform:uppercase;letter-spacing:.12em" : ""}}
.lede{font-size:calc(var(--dna-size-body) * 1.125);max-width:var(--dna-measure)}
.action{display:inline-flex;align-items:center;min-height:48px;padding-inline:1.5rem;background:var(--dna-accent);color:var(--dna-accent-fg);border-radius:var(--dna-radius-control);text-decoration:none;font-weight:600;box-shadow:${shadow};transition:transform var(--dna-duration) ease}
.action:hover{transform:translateY(-1px)}
.band--accent .action,.band--inverse .action{background:var(--dna-bg);color:var(--dna-fg)}
.media{aspect-ratio:${aspect};background:color-mix(in srgb, var(--dna-accent) 18%, var(--dna-surface));border:var(--dna-border-width) solid var(--dna-border);border-radius:var(--dna-radius)}
.items{list-style:none;margin:0;padding:0;display:grid;gap:var(--dna-gutter)}
.items li{display:grid;gap:var(--dna-unit);align-content:start}
.items p{color:var(--dna-muted)}
.layout--grid .items{grid-template-columns:repeat(var(--cols), minmax(0, 1fr))}
.layout--grid .items li{padding:calc(var(--dna-unit) * 3);border:var(--dna-border-width) solid var(--dna-border);border-radius:var(--dna-radius);background:var(--dna-bg);box-shadow:${shadow}}
.layout--index .items{counter-reset:row;gap:0}
.layout--index .items li{counter-increment:row;grid-template-columns:4rem minmax(0,1fr) minmax(0,1.4fr) auto;align-items:baseline;gap:var(--dna-gutter);padding-block:calc(var(--dna-unit) * 3);border-top:var(--dna-border-width) solid var(--dna-border)}
.layout--index .items li > .meta{grid-column:4;white-space:nowrap}
.layout--index .items li::before{content:counter(row, decimal-leading-zero);font-family:var(--dna-font-mono);font-size:var(--dna-size-small);color:var(--dna-muted)}
.layout--centered{justify-items:center;text-align:center}
.layout--centered .text{justify-items:center}
@media (min-width: 48rem){
.layout--split{grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center}
.layout--asymmetric{grid-template-columns:minmax(0,7fr) minmax(0,5fr);align-items:end}
.layout--split .items,.layout--asymmetric .items{grid-column:1 / -1}
.layout--asymmetric .items{grid-template-columns:repeat(2, minmax(0,1fr))}
.layout--full-bleed{min-height:min(78dvh, 760px);align-content:end}
}
@media (max-width: 47.99rem){
.layout--grid .items{grid-template-columns:minmax(0,1fr)}
.layout--index .items li{grid-template-columns:3rem minmax(0,1fr)}
.layout--index .items li > p,.layout--index .items li > .meta{grid-column:2;white-space:normal}
}
@media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}
`;
}
