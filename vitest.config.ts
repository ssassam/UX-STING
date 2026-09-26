import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const pkg = (name: string) => fileURLToPath(new URL(`./packages/${name}/src`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@unified-ui\/react\/(.*)$/, replacement: `${pkg("react")}/components/$1/index.ts` },
      { find: "@unified-ui/icons/dynamic", replacement: `${pkg("icons")}/icon.tsx` },
      { find: "@unified-ui/tokens", replacement: `${pkg("tokens")}/index.ts` },
      { find: "@unified-ui/themes", replacement: `${pkg("themes")}/index.ts` },
      { find: "@unified-ui/utils", replacement: `${pkg("utils")}/index.ts` },
      { find: "@unified-ui/hooks", replacement: `${pkg("hooks")}/index.ts` },
      { find: "@unified-ui/primitives", replacement: `${pkg("primitives")}/index.ts` },
      { find: "@unified-ui/icons", replacement: `${pkg("icons")}/index.ts` },
      { find: "@unified-ui/core", replacement: `${pkg("core")}/index.ts` },
      { find: "@unified-ui/react", replacement: `${pkg("react")}/index.ts` },
    ],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["packages/*/src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**"],
    css: false,
    testTimeout: 15000,
  },
});
