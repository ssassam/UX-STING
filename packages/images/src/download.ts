import { lookup } from "node:dns/promises";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { checkTargetUrl, isPrivateAddress } from "@ux-sting/design-dna";
import { creditsMarkdown, toEntry, type CreditEntry } from "./credits.js";
import { USER_AGENT, type ImageResult } from "./sources.js";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};
const MAX_BYTES = 15 * 1024 * 1024;

export const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "image";

/** Refuses private, local and metadata hosts, including via DNS. */
async function guard(url: string) {
  const check = checkTargetUrl(url);
  if (!check.ok) throw new Error(`Refused ${url}: ${check.reason}`);
  const addresses = await lookup(check.url!.hostname, { all: true });
  if (addresses.some((a) => isPrivateAddress(a.address)))
    throw new Error(`Refused ${url}: resolves to a private address.`);
}

/** Downloads one image into `dir`, returning its file name. Redirects are re-checked. */
export async function downloadImage(
  r: ImageResult,
  dir: string,
  f: typeof fetch = fetch,
): Promise<string> {
  let url = r.url;
  let res: Response | undefined;
  for (let hop = 0; hop < 5; hop++) {
    await guard(url);
    res = await f(url, {
      headers: { "user-agent": USER_AGENT },
      redirect: "manual",
      signal: AbortSignal.timeout(60_000),
    });
    const next = res.status >= 300 && res.status < 400 ? res.headers.get("location") : null;
    if (!next) break;
    url = new URL(next, url).toString();
  }
  if (!res?.ok) throw new Error(`Download failed (${res?.status}) for ${r.url}`);
  const type = (res.headers.get("content-type") ?? "").split(";")[0]!.trim();
  const ext = EXT[type];
  if (!ext) throw new Error(`Not an image (${type || "no content-type"}): ${r.url}`);
  const declared = Number(res.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES) throw new Error(`Image larger than 15 MB: ${r.url}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length > MAX_BYTES) throw new Error(`Image larger than 15 MB: ${r.url}`);
  mkdirSync(dir, { recursive: true });
  let name = `${slugify(r.title)}.${ext}`;
  for (let i = 2; existsSync(join(dir, name)); i++) name = `${slugify(r.title)}-${i}.${ext}`;
  writeFileSync(join(dir, name), bytes);
  return name;
}

/**
 * Adds downloaded images to `credits.json` (merged by id) and regenerates
 * `CREDITS.md` next to it. Returns the full manifest.
 */
export function recordCredits(
  manifestPath: string,
  items: Array<{ result: ImageResult; file: string }>,
): CreditEntry[] {
  const existing: CreditEntry[] = existsSync(manifestPath)
    ? (JSON.parse(readFileSync(manifestPath, "utf8")) as CreditEntry[])
    : [];
  const byId = new Map(existing.map((e) => [e.id, e]));
  const base = dirname(manifestPath);
  for (const { result, file } of items)
    byId.set(result.id, toEntry(result, relative(base, file).replace(/\\/g, "/")));
  const all = [...byId.values()];
  mkdirSync(base, { recursive: true });
  writeFileSync(manifestPath, JSON.stringify(all, null, 2) + "\n");
  writeFileSync(join(base, "CREDITS.md"), creditsMarkdown(all));
  return all;
}
