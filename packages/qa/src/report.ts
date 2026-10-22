import type { QaReport } from "./types.js";

const fmtMs = (ms: number | null) => (ms === null ? "—" : `${(ms / 1000).toFixed(1)}s`);

/**
 * A short markdown report an agent can read in one pass: a per-viewport
 * table, the top three fixes and at most 12 further findings. Full details
 * stay in report.json.
 */
export function toMarkdown(report: QaReport): string {
  const lines: string[] = [];
  lines.push(`# QA — ${report.target}`);
  lines.push("");
  lines.push(
    `**${report.passed ? "PASS" : "FAIL"}** · score ${report.score}/100 · ${report.findings.length} finding(s) · ${report.createdAt}`,
  );
  lines.push("");
  lines.push("| Viewport | Overflow | Axe | Contrast fails | LCP | CLS | Screenshot |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const v of report.viewports) {
    const axe = v.axe.filter((a) => a.id !== "color-contrast").reduce((n, a) => n + a.count, 0);
    lines.push(
      `| ${v.width}px | ${v.layout.overflow.px}px | ${axe} | ${v.layout.contrast.failing.length}/${v.layout.contrast.checked} | ${fmtMs(v.vitals.lcp)} | ${v.vitals.cls ?? "—"} | ${v.screenshots.fold ?? "—"} |`,
    );
  }
  lines.push("");
  lines.push("## Top 3 fixes");
  lines.push("");
  if (!report.top.length) lines.push("Nothing to fix.");
  report.top.forEach((f, i) => {
    const where = f.targets.length ? ` — \`${f.targets.slice(0, 2).join("`, `")}\`` : "";
    const vps = f.viewports.length ? ` @ ${f.viewports.join("/")}` : "";
    lines.push(`${i + 1}. **[${f.severity}] ${f.id}**${vps}: ${f.message}${where}`);
    lines.push(`   Fix: ${f.fix}`);
  });
  const rest = report.findings.slice(report.top.length, report.top.length + 12);
  if (rest.length) {
    lines.push("");
    lines.push("## Other findings");
    lines.push("");
    for (const f of rest)
      lines.push(
        `- [${f.severity}] ${f.id}${f.viewports.length ? ` @ ${f.viewports.join("/")}` : ""}: ${f.message}`,
      );
    const hidden = report.findings.length - report.top.length - rest.length;
    if (hidden > 0) lines.push(`- …and ${hidden} more in report.json`);
  }
  return lines.join("\n") + "\n";
}
