import { readFileSync } from "node:fs";

// The repository README is not included when npm publishes this workspace.
// Fail before packing if the package-level README is missing or empty.
const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
if (!readme.trim() || !readme.includes("npx ux-sting init")) {
  throw new Error("The ux-sting package README must include installation instructions.");
}
