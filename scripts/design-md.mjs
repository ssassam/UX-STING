import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  presets,
  PRESET_NAMES,
  themeToDesignMd,
  importDesignMd,
} from "../packages/themes/dist/index.js";
const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: { out: { type: "string" } },
});
const [command, input] = positionals;
try {
  if (command === "export" && input) {
    const names = input === "all" ? PRESET_NAMES : PRESET_NAMES.filter((name) => name === input);
    if (!names.length) throw new Error(`Unknown preset: ${input}`);
    const dir = resolve(values.out ?? "design-dna-output/designs");
    await mkdir(dir, { recursive: true });
    for (const name of names)
      await writeFile(resolve(dir, `${name}.DESIGN.md`), themeToDesignMd(presets[name]), {
        flag: "wx",
      });
    console.log(`Exported ${names.length} theme(s) to ${dir}`);
  } else if (command === "import" && input) {
    const result = importDesignMd(await readFile(input, "utf8"));
    const output = JSON.stringify(result, null, 2) + "\n";
    if (values.out) await writeFile(values.out, output, { flag: "wx" });
    else process.stdout.write(output);
  } else
    throw new Error(
      "Usage: node scripts/design-md.mjs export <all|preset> [--out directory]\n       node scripts/design-md.mjs import <DESIGN.md> [--out theme.json]",
    );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
