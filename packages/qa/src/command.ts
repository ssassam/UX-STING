import { resolve } from "node:path";
import { toMarkdown } from "./report.js";
import { runQa } from "./run.js";

export const QA_HELP = `ux-sting qa <url|path> — render, measure and rank what to fix

  <url|path>            http(s) URL, or a local .html file / static export folder
  --out <dir>           Where report.md, report.json and shots/ go (default: ux-sting-qa)
  --viewports <list>    Comma-separated widths (default: 375,768,1440)
  --allow-host <h:p>    Extra private host:port subrequests may reach (repeatable)
  --no-shots            Skip screenshots
  --no-taste            Skip anti-slop checks (purple gradients, emoji icons, stock copy…)
  --json                Print the JSON report instead of markdown
  --fail-on <level>     Exit 1 on: serious (default) | moderate | none

Exit code 1 means a finding at or above --fail-on remains.`;

const LEVELS = { none: 0, moderate: 2, serious: 3 } as const;
const RANK = { minor: 1, moderate: 2, serious: 3, critical: 4 } as const;

/** Entry point shared by `ux-sting qa` and the `ux-sting-qa` bin. Returns an exit code. */
export async function qaCommand(argv: string[], print = console.log): Promise<number> {
  const value = (name: string) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const valued = new Set(["--out", "--viewports", "--allow-host", "--fail-on"]);
  const target = argv.find((a, i) => !a.startsWith("--") && !valued.has(argv[i - 1] ?? ""));
  if (!target || argv.includes("--help") || argv.includes("-h")) {
    print(QA_HELP);
    return target ? 0 : 1;
  }
  const failOn = (value("fail-on") ?? "serious") as keyof typeof LEVELS;
  if (!(failOn in LEVELS)) {
    print(`Unknown --fail-on "${failOn}".`);
    return 1;
  }
  const outDir = resolve(value("out") ?? "ux-sting-qa");
  const report = await runQa(target, {
    outDir,
    viewports: value("viewports")
      ?.split(",")
      .map(Number)
      .filter((n) => n > 0),
    allowHosts: argv.flatMap((a, i) => (argv[i - 1] === "--allow-host" ? [a] : [])),
    screenshots: !argv.includes("--no-shots"),
    taste: !argv.includes("--no-taste"),
  });
  print(argv.includes("--json") ? JSON.stringify(report, null, 2) : toMarkdown(report));
  if (!argv.includes("--json")) print(`Report: ${outDir}/report.md`);
  const threshold = LEVELS[failOn];
  return threshold && report.findings.some((f) => RANK[f.severity] >= threshold) ? 1 : 0;
}
