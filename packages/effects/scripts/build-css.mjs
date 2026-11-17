import { copyFile } from "node:fs/promises";
await copyFile(
  new URL("../src/effects.css", import.meta.url),
  new URL("../dist/effects.css", import.meta.url),
);
