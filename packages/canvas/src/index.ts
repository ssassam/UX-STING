import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { serveStatic, type StaticServer } from "@ux-sting/qa";

export interface CanvasDirection {
  id: string;
  title: string;
  url: string;
  rationale?: string;
  score?: number;
}
const esc = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
/** Generates a local comparison board. Frames are sandboxed; no external messaging or persistence. */
export function renderCanvas(directions: CanvasDirection[]): string {
  if (!directions.length || new Set(directions.map((d) => d.id)).size !== directions.length)
    throw new Error("Provide at least one direction with unique IDs.");
  const cards = directions
    .map((d) => {
      const url = new URL(d.url);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password)
        throw new Error("Preview URLs must be HTTP(S) without credentials.");
      return `<article><header><h2>${esc(d.title)}</h2>${d.score === undefined ? "" : `<span>Score ${Number(d.score)}</span>`}</header><p>${esc(d.rationale ?? "")}</p><div class="preview"><iframe title="${esc(d.title)} preview" src="${esc(url.href)}" sandbox="allow-scripts" loading="lazy" referrerpolicy="no-referrer"></iframe></div><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Open preview</a><button type="button" data-select="${esc(d.id)}" aria-pressed="false">Select ${esc(d.title)}</button></article>`;
    })
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>UX-STING directions</title><meta name="author" content="Veltein"><link rel="author" href="https://veltein.com/"><style>
*{box-sizing:border-box}body{margin:0;background:#f5f3ee;color:#1b1b19;font-family:system-ui,sans-serif}main{padding:clamp(16px,4vw,56px)}h1{font-size:clamp(30px,4vw,56px);font-weight:500;letter-spacing:-.04em;margin:0 0 16px}p{line-height:1.6;max-width:65ch}.toolbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:24px 0}.board{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:24px}article{min-width:0;border-top:2px solid #1b1b19;padding-top:16px}article header{display:flex;align-items:baseline;justify-content:space-between;gap:16px}h2{font-size:22px;margin:0}button,select,a{min-height:44px}button,select{padding:8px 16px;background:transparent;border:1px solid #777;color:inherit;font:inherit;cursor:pointer}button[aria-pressed=true]{background:#1b1b19;color:white}a{display:inline-flex;align-items:center;margin-inline-end:16px;color:inherit}button:focus-visible,select:focus-visible,a:focus-visible{outline:3px solid #255cbe;outline-offset:3px}.preview{overflow:auto;height:600px;background:white;border:1px solid #ccc;margin:16px 0}iframe{display:block;border:0;width:100%;height:100%}footer{padding:24px clamp(16px,4vw,56px);border-top:1px solid #aaa}#selection{font-weight:600}
</style></head><body><main><h1>Compare design directions</h1><p>Review layout, reading order, and the primary action at each viewport. Selection is kept in this tab only.</p><div class="toolbar"><label for="width">Viewport</label><select id="width"><option value="100%">Fit panel</option><option value="390px">Mobile · 390px</option><option value="768px">Tablet · 768px</option><option value="1440px">Desktop · 1440px</option></select><p id="selection" role="status">No direction selected</p></div><div class="board">${cards}</div></main><footer><a href="https://veltein.com/" target="_blank" rel="noopener noreferrer">Made with love by Veltein</a></footer><script>
document.getElementById('width').addEventListener('change',function(){document.querySelectorAll('iframe').forEach(function(frame){frame.style.width=document.getElementById('width').value})});document.querySelectorAll('[data-select]').forEach(function(button){button.addEventListener('click',function(){document.querySelectorAll('[data-select]').forEach(function(other){other.setAttribute('aria-pressed',String(other===button))});document.getElementById('selection').textContent='Selected: '+button.dataset.select})});
</script></body></html>`;
}
export async function startCanvas(
  directions: CanvasDirection[],
  outDir: string,
): Promise<StaticServer> {
  const dir = resolve(outDir);
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), renderCanvas(directions), { flag: "wx" });
  return serveStatic(dir);
}
