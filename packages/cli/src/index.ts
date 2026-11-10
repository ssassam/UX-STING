import { fileURLToPath } from "node:url";
import { add, diff, init, list } from "./commands.js";
import { eject, update } from "./eject.js";
import { bold, dim, log } from "./log.js";
import { runPlugin } from "./plugins.js";
import { installSkills, listHosts } from "./skills.js";

const HELP = `${bold("ux-sting")} — copy accessible React components into your project

${bold("Usage")}
  npx ux-sting init [--dir <path>] [--css <file>] [--force]
  npx ux-sting add <component...> [--overwrite] [--dry-run]
  npx ux-sting list
  npx ux-sting diff [component...]
  npx ux-sting update [component...] [--dry-run]
  npx ux-sting eject <component...> [--overwrite] [--dry-run] [--no-codemod]
  npx ux-sting qa <url|path> [--out <dir>] [--viewports 375,768,1440] [--json]
  npx ux-sting extract <url> [--out <dir>]
  npx ux-sting theme import <tokens.json…> [--name <name>] [--out <dir>]
  npx ux-sting theme export <preset|name.theme.json> [--out <dir>] [--resolved]
  npx ux-sting dna <url|tokens.json> [--json]
  npx ux-sting images <query> [--source commons,met,openverse] [--download 1,3]
  npx ux-sting tokens export [--format dtcg,css,scss,tailwind] [--out <dir>]
  npx ux-sting skills add [--ai <host,…|all>] [--global] [--only <skill,…>] [--dry-run]
  npx ux-sting skills remove [--ai <host,…|all>] [--global]
  npx ux-sting skills hosts

${bold("Options")}
  --cwd <path>        Project root (default: current directory)
  --no-install        Print the install command instead of running it
  --registry <src>    Registry file or URL (default: bundled registry)
  -y, --yes           Accept defaults
  -h, --help          Show help

${bold("Skills")}  Installs the 10 UX-STING agent skills (design agent, taste + design data, slides, logo,
  review, QA, 3D, diagrams…) into 24 AI coding hosts: Claude Code, Codex, Cursor,
  Windsurf, Copilot, Gemini, Antigravity, Qoder, Kiro, Roo, KiloCode, Cline, Continue,
  OpenCode, Trae, Augment, CodeBuddy, Warp, Droid, Amazon Q, Kimi, ZCode, CodeWhale,
  OpenClaw. Without --ai it detects the hosts used in the project.

${bold("Eject")}  For apps using the @ux-sting/react package: copies the component's source
  into your project (its other dependencies stay on the package so React context
  is shared) and rewrites your imports to the local copy. \`update\` later merges
  upstream changes; edited files get a <file>.upstream next to them.
`;

interface Parsed {
  command?: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseArgs(argv: string[]): Parsed {
  const parsed: Parsed = { args: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg.startsWith("--no-")) parsed.flags[arg.slice(5)] = false;
    else if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=");
      const next = argv[i + 1];
      if (inline !== undefined) parsed.flags[key!] = inline;
      else if (
        ["dir", "css", "cwd", "registry", "ai", "only"].includes(key!) &&
        next &&
        !next.startsWith("-")
      )
        parsed.flags[key!] = argv[++i]!;
      else parsed.flags[key!] = true;
    } else if (arg === "-y") parsed.flags.yes = true;
    else if (arg === "-h") parsed.flags.help = true;
    else if (!parsed.command) parsed.command = arg;
    else parsed.args.push(arg);
  }
  return parsed;
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const { command, args, flags } = parseArgs(argv);
  const common = {
    cwd: typeof flags.cwd === "string" ? flags.cwd : process.cwd(),
    yes: Boolean(flags.yes),
    install: flags.install !== false,
    registry: typeof flags.registry === "string" ? flags.registry : undefined,
  };
  try {
    switch (command) {
      case "init":
        await init({
          ...common,
          dir: flags.dir as string | undefined,
          css: flags.css as string | undefined,
          force: Boolean(flags.force),
        });
        return 0;
      case "add":
        await add(args, {
          ...common,
          overwrite: Boolean(flags.overwrite),
          dryRun: Boolean(flags["dry-run"]),
        });
        return 0;
      case "list":
      case "ls":
        await list(common);
        return 0;
      case "eject":
        await eject(args, {
          ...common,
          overwrite: Boolean(flags.overwrite),
          dryRun: Boolean(flags["dry-run"]),
          noCodemod: flags.codemod === false,
        });
        return 0;
      case "update": {
        const res = await update(args, { ...common, dryRun: Boolean(flags["dry-run"]) });
        return res.conflicts.length ? 1 : 0;
      }
      case "diff": {
        const entries = await diff(args, common);
        return entries.some((e) => e.status === "outdated") ? 1 : 0;
      }
      case "qa":
        return await runPlugin(
          "@ux-sting/qa",
          async () => ({ run: (await import("@ux-sting/qa")).qaCommand }),
          argv.slice(argv.indexOf("qa") + 1),
        );
      case "extract":
      case "theme":
      case "dna": {
        const rest = argv.slice(argv.indexOf(command) + 1);
        return await runPlugin(
          "@ux-sting/extract",
          async () => {
            const m = await import("@ux-sting/extract");
            const run = { extract: m.extractCommand, theme: m.themeCommand, dna: m.dnaCommand }[
              command
            ];
            return { run };
          },
          rest,
        );
      }
      case "images":
        return await runPlugin(
          "@ux-sting/images",
          async () => ({ run: (await import("@ux-sting/images")).imagesCommand }),
          argv.slice(argv.indexOf("images") + 1),
        );
      case "tokens":
        return await runPlugin(
          "@ux-sting/extract",
          async () => ({ run: (await import("@ux-sting/extract")).tokensCommand }),
          argv.slice(argv.indexOf("tokens") + 1),
        );
      case "skills": {
        const sub = args[0] ?? "add";
        if (sub === "hosts" || sub === "list") {
          listHosts(common.cwd);
          return 0;
        }
        if (sub !== "add" && sub !== "remove") {
          log.error(`Unknown skills command "${sub}". Use add, remove or hosts.`);
          return 1;
        }
        installSkills({
          cwd: common.cwd,
          ai: typeof flags.ai === "string" ? flags.ai : flags.ai === true ? "all" : undefined,
          global: Boolean(flags.global),
          only: typeof flags.only === "string" ? flags.only : undefined,
          dryRun: Boolean(flags["dry-run"]),
          remove: sub === "remove",
        });
        return 0;
      }
      case undefined:
      case "help":
        log.info(HELP);
        return 0;
      default:
        log.error(`Unknown command "${command}".`);
        log.info(dim("Run `ux-sting --help`."));
        return 1;
    }
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

// Compare with forward slashes so the check also works on Windows, where
// `process.argv[1]` arrives with backslash separators.
const toPosix = (path: string) => path.replace(/\\/g, "/");
const self = toPosix(fileURLToPath(import.meta.url));
const invoked = toPosix(process.argv[1] ?? "");
const isEntry =
  invoked === self || invoked.endsWith("/ux-sting") || invoked.endsWith("/cli/dist/index.js");
if (isEntry) {
  if (
    process.argv.includes("--help") &&
    !["qa", "extract", "theme", "dna", "images", "tokens"].includes(process.argv[2] ?? "")
  ) {
    log.info(HELP);
  } else {
    main().then((code) => process.exit(code));
  }
}
