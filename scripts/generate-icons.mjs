/**
 * Generates tree-shakeable icon modules for @ux-sting/icons from Lucide's
 * icon node data (ISC License — see packages/icons/LICENSE-lucide).
 * Run with `pnpm icons` after changing the ICONS list.
 */
import { mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import * as lucide from "lucide";

const ICONS = [
  "Activity",
  "AlertCircle",
  "AlertTriangle",
  "Archive",
  "Armchair",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowUpDown",
  "ArrowUpRight",
  "AtSign",
  "Baby",
  "BadgeCheck",
  "BadgePercent",
  "Bath",
  "BatteryFull",
  "Bed",
  "Bell",
  "Bluetooth",
  "Bold",
  "Bookmark",
  "Building2",
  "Calendar",
  "CalendarDays",
  "Camera",
  "Car",
  "ChartArea",
  "ChartBar",
  "ChartCandlestick",
  "ChartLine",
  "ChartPie",
  "Check",
  "CheckCircle2",
  "ChevronDown",
  "ChevronLeft",
  "ChevronRight",
  "ChevronUp",
  "ChevronsLeft",
  "ChevronsRight",
  "ChevronsUpDown",
  "Circle",
  "Clock",
  "Cloud",
  "Coffee",
  "Cog",
  "Coins",
  "Command",
  "Compass",
  "Copy",
  "Cpu",
  "CreditCard",
  "Crown",
  "DoorOpen",
  "Dot",
  "Download",
  "Droplets",
  "Dumbbell",
  "Edit",
  "Ellipsis",
  "EllipsisVertical",
  "ExternalLink",
  "Eye",
  "EyeOff",
  "File",
  "FileText",
  "Filter",
  "Flag",
  "Flame",
  "Folder",
  "FolderOpen",
  "Footprints",
  "Fuel",
  "Gauge",
  "Gift",
  "Globe",
  "Grid3x3",
  "GripVertical",
  "Hash",
  "Headphones",
  "Heart",
  "HeartPulse",
  "HelpCircle",
  "Home",
  "Hotel",
  "Image",
  "Inbox",
  "Info",
  "Italic",
  "Key",
  "KeyRound",
  "Lamp",
  "Landmark",
  "Languages",
  "LayoutDashboard",
  "LayoutGrid",
  "Leaf",
  "Lightbulb",
  "Link",
  "List",
  "ListFilter",
  "Loader2",
  "Lock",
  "LogIn",
  "LogOut",
  "Luggage",
  "Mail",
  "Map",
  "MapPin",
  "Maximize2",
  "Menu",
  "MessageSquare",
  "Mic",
  "Minus",
  "Monitor",
  "Moon",
  "Mountain",
  "Music",
  "Navigation",
  "Newspaper",
  "Package",
  "Paperclip",
  "Pause",
  "Pencil",
  "Phone",
  "Pizza",
  "Plane",
  "PlaneTakeoff",
  "Play",
  "Plus",
  "PlusCircle",
  "Printer",
  "Quote",
  "Recycle",
  "RefreshCw",
  "RotateCcw",
  "Route",
  "Rss",
  "Satellite",
  "Save",
  "Scale",
  "Search",
  "Send",
  "Settings",
  "Share2",
  "Shield",
  "ShieldCheck",
  "Ship",
  "ShoppingBag",
  "ShoppingCart",
  "Signal",
  "SkipBack",
  "SkipForward",
  "SlidersHorizontal",
  "Smartphone",
  "Snowflake",
  "Sofa",
  "Sparkles",
  "Square",
  "Star",
  "StarHalf",
  "Store",
  "Sun",
  "SunMoon",
  "Table",
  "Tablet",
  "Tag",
  "Tent",
  "Ticket",
  "Timer",
  "TrainFront",
  "Trash2",
  "TreePalm",
  "TrendingDown",
  "TrendingUp",
  "Truck",
  "Umbrella",
  "Underline",
  "Undo2",
  "Upload",
  "UploadCloud",
  "User",
  "UserPlus",
  "Users",
  "Utensils",
  "Verified",
  "Video",
  "Volume2",
  "VolumeX",
  "Wallet",
  "Watch",
  "Waves",
  "Wifi",
  "X",
  "XCircle",
  "Zap",
  "ZoomIn",
  "ZoomOut",
];

const root = fileURLToPath(new URL("../packages/icons/", import.meta.url));
const dir = `${root}src/icons/`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase();

const entries = [];
for (const name of ICONS) {
  const node = lucide[name];
  if (!node) throw new Error(`Lucide icon not found: ${name}`);
  const file = kebab(name);
  const component = `${name}Icon`;
  writeFileSync(
    `${dir}${file}.ts`,
    `// Generated from Lucide (ISC License). Do not edit by hand.\nimport { createIcon } from "../create-icon.js";\n\nexport const ${component} = createIcon("${file}", ${JSON.stringify(node)});\n`,
  );
  entries.push({ file, component });
}

writeFileSync(
  `${dir}index.ts`,
  "// Generated file. Do not edit by hand.\n" +
    entries.map((e) => `export { ${e.component} } from "./${e.file}.js";`).join("\n") +
    "\n",
);

writeFileSync(
  `${root}src/registry.ts`,
  "// Generated file. Do not edit by hand.\n" +
    entries.map((e) => `import { ${e.component} } from "./icons/${e.file}.js";`).join("\n") +
    "\n\nexport const iconRegistry = {\n" +
    entries.map((e) => `  "${e.file}": ${e.component},`).join("\n") +
    "\n} as const;\n\nexport type IconName = keyof typeof iconRegistry;\n",
);

const require = createRequire(import.meta.url);
copyFileSync(
  require.resolve("lucide/LICENSE", { paths: [process.cwd()] }),
  `${root}LICENSE-lucide`,
);
console.log(`Generated ${entries.length} icons.`);
