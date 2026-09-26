import { add, diff, init, list } from "./commands.js";
import { bold, dim, log } from "./log.js";

const HELP = `${bold("unified-ui")} — copy accessible React components into your project

${bold("Usage")}
  npx unified-ui init [--dir <path>] [--css <file>] [--force]
  npx unified-ui add <component...> [--overwrite] [--dry-run]
  npx unified-ui list
  npx unified-ui diff [component...]

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
      else if (["dir", "css", "cwd", "registry"].includes(key!) && next && !next.startsWith("-")) parsed.flags[key!] = argv[++i]!;
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
        await init({ ...common, dir: flags.dir as string | undefined, css: flags.css as string | undefined, force: Boolean(flags.force) });
        return 0;
      case "add":
        await add(args, { ...common, overwrite: Boolean(flags.overwrite), dryRun: Boolean(flags["dry-run"]) });
        return 0;
      case "list":
      case "ls":
        await list(common);
        return 0;
      case "diff": {
        const entries = await diff(args, common);
        return entries.some((e) => e.status === "outdated") ? 1 : 0;
      }
      case undefined:
      case "help":
        log.info(HELP);
        return 0;
      default:
        log.error(`Unknown command "${command}".`);
        log.info(dim("Run `unified-ui --help`."));
        return 1;
    }
  } catch (error) {
    log.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

const isEntry = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("/unified-ui") || process.argv[1]?.endsWith("cli/dist/index.js");
if (isEntry) {
  if (process.argv.includes("--help")) {
    log.info(HELP);
  } else {
    main().then((code) => process.exit(code));
  }
}
