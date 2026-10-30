import { fileURLToPath } from "node:url";
import { add, diff, init, list } from "./commands.js";
import { bold, dim, log } from "./log.js";
import { runPlugin } from "./plugins.js";

const HELP = `${bold("ux-sting")} — copy accessible React components into your project

${bold("Usage")}
  npx ux-sting init [--dir <path>] [--css <file>] [--force]
  npx ux-sting add <component...> [--overwrite] [--dry-run]
  npx ux-sting list
  npx ux-sting diff [component...]
  npx ux-sting qa <url|path> [--out <dir>] [--viewports 375,768,1440] [--json]
  npx ux-sting extract <url> [--out <dir>]
  npx ux-sting theme import <tokens.json> [--name <name>] [--out <dir>]
  npx ux-sting dna <url|tokens.json> [--json]
  npx ux-sting images <query> [--source commons,met,openverse] [--download 1,3]
  npx ux-sting tokens export [--format dtcg,css,scss,tailwind] [--out <dir>]

${bold("Options")}
  --cwd <path>        Project root (default: current directory)
  --no-install        Print the install command instead of running it
  --registry <src>    Registry file or URL (default: bundled registry)
  -y, --yes           Accept defaults
  -h, --help          Show help
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
      else if (["dir", "css", "cwd", "registry"].includes(key!) && next && !next.startsWith("-"))
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
