import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@demos": fileURLToPath(new URL("../docs/demos", import.meta.url)) },
  },
  server: { fs: { allow: ["../.."] } },
});
