import { join, resolve } from "node:path";
import { creditText, licenseLabel } from "./credits.js";
import { downloadImage, recordCredits } from "./download.js";
import { normalizeLicense, searchImages, type LicenseCode, type SourceName } from "./sources.js";

export const IMAGES_HELP = `ux-sting images <query> — openly licensed images with credits

  --source <list>     openverse,commons,met (default: all)
  --license <list>    cc0,pdm,by,by-sa (default: all four; NC/ND never)
  --count <n>         Results per source (default 6)
  --download <ids>    Download results by number (e.g. 1,3) or "all"
  --dir <path>        Where images go (default: public/images)
  --credits <file>    Credits manifest (default: <dir>/credits.json; CREDITS.md beside it)
  --json              Print results as JSON

Every downloaded image is recorded with title, author, source and license;
render entry.credit (or creditHtml) next to the image or on a credits page.`;

export async function imagesCommand(
  argv: string[],
  print: (l: string) => void = console.log,
): Promise<number> {
  const valued = ["--source", "--license", "--count", "--download", "--dir", "--credits"];
  const query = argv
    .filter((a, i) => !a.startsWith("--") && !valued.includes(argv[i - 1] ?? ""))
    .join(" ");
  const opt = (n: string) => {
    const i = argv.indexOf(`--${n}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  if (!query || argv.includes("--help")) {
    print(IMAGES_HELP);
    return query ? 0 : 1;
  }
  const licenses = opt("license")
    ?.split(",")
    .map((l) => normalizeLicense(l.trim())?.code)
    .filter((l): l is LicenseCode => Boolean(l));
  const { results, errors } = await searchImages(query, {
    sources: opt("source")?.split(",") as SourceName[] | undefined,
    licenses,
    count: Number(opt("count")) || 6,
  });
  for (const e of errors) print(`! ${e}`);
  if (argv.includes("--json")) {
    print(JSON.stringify(results, null, 2));
    return results.length ? 0 : 1;
  }
  if (!results.length) {
    print(
      "No openly licensed images found. Try broader words, another source, or a different subject.",
    );
    return 1;
  }
  print("| # | Title | Creator | License | Source | Size |");
  print("| --- | --- | --- | --- | --- | --- |");
  results.forEach((r, i) =>
    print(
      `| ${i + 1} | ${r.title.slice(0, 60)} | ${(r.creator ?? "—").slice(0, 30)} | ${licenseLabel(r)} | ${r.source} | ${r.width && r.height ? `${r.width}×${r.height}` : "—"} |`,
    ),
  );

  const pick = opt("download");
  if (!pick) {
    print("\nDownload with --download 1,3 (records credits automatically).");
    return 0;
  }
  const chosen =
    pick === "all"
      ? results
      : pick
          .split(",")
          .map((n) => results[Number(n) - 1])
          .filter((r): r is (typeof results)[number] => Boolean(r));
  const dir = resolve(opt("dir") ?? "public/images");
  const manifest = resolve(opt("credits") ?? join(dir, "credits.json"));
  const done: Array<{ result: (typeof results)[number]; file: string }> = [];
  for (const r of chosen) {
    try {
      const name = await downloadImage(r, dir);
      done.push({ result: r, file: join(dir, name) });
      print(`✔ ${name} — ${creditText(r)}`);
    } catch (error) {
      print(`✖ ${r.title}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (done.length) {
    recordCredits(manifest, done);
    print(`Credits: ${manifest} and CREDITS.md beside it.`);
  }
  return done.length === chosen.length ? 0 : 1;
}
