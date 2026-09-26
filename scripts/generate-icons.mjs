/**
 * Generates tree-shakeable icon modules for @unified-ui/icons from Lucide's
 * icon node data (ISC License — see packages/icons/LICENSE-lucide).
 * Run with `pnpm icons` after changing the ICONS list.
 */
import { mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import * as lucide from "lucide";

const ICONS = [
  "AlertCircle", "AlertTriangle", "Archive", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp",
  "ArrowUpDown", "ArrowUpRight", "AtSign", "Bath", "Bed", "Bell", "Bold", "Bookmark", "Building2",
  "Calendar", "CalendarDays", "Camera", "Car", "ChartBar", "ChartLine", "ChartPie", "Check", "CheckCircle2",
  "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp", "ChevronsLeft", "ChevronsRight",
  "ChevronsUpDown", "Circle", "Clock", "Cloud", "Coffee", "Command", "Copy", "CreditCard", "Crown",
  "Dot", "Download", "Dumbbell", "Edit", "Ellipsis", "EllipsisVertical", "ExternalLink", "Eye", "EyeOff",
  "File", "FileText", "Filter", "Flag", "Folder", "FolderOpen", "Globe", "Grid3x3", "GripVertical",
  "Hash", "Heart", "HelpCircle", "Home", "Hotel", "Image", "Inbox", "Info", "Italic", "Key", "Languages",
  "LayoutDashboard", "LayoutGrid", "Link", "List", "ListFilter", "Loader2", "Lock", "LogIn", "LogOut",
  "Mail", "Map", "MapPin", "Maximize2", "Menu", "MessageSquare", "Mic", "Minus", "Monitor", "Moon",
  "Navigation", "Newspaper", "Package", "Paperclip", "Pause", "Pencil", "Phone", "Pizza", "Play", "Plus",
  "PlusCircle", "Printer", "RefreshCw", "RotateCcw", "Save", "Search", "Send", "Settings", "Share2",
  "Shield", "ShieldCheck", "ShoppingBag", "ShoppingCart", "SkipBack", "SkipForward", "SlidersHorizontal",
  "Smartphone", "Sparkles", "Square", "Star", "StarHalf", "Store", "Sun", "SunMoon", "Table", "Tag",
  "Tablet", "Trash2", "TrendingDown", "TrendingUp", "Truck", "Underline", "Upload", "UploadCloud", "User",
  "UserPlus", "Users", "Utensils", "Verified", "Video", "Volume2", "VolumeX", "Wallet", "Wifi", "X",
  "XCircle", "Zap", "ZoomIn", "ZoomOut",
];

const root = fileURLToPath(new URL("../packages/icons/", import.meta.url));
const dir = `${root}src/icons/`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").replace(/([a-z])(\d)/g, "$1-$2").toLowerCase();

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
copyFileSync(require.resolve("lucide/LICENSE", { paths: [process.cwd()] }), `${root}LICENSE-lucide`);
console.log(`Generated ${entries.length} icons.`);
