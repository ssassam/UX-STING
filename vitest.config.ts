import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const pkg = (name: string) => fileURLToPath(new URL(`./packages/${name}/src`, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@ux-sting\/react\/(.*)$/, replacement: `${pkg("react")}/components/$1/index.ts` },
      { find: "@ux-sting/icons/dynamic", replacement: `${pkg("icons")}/icon.tsx` },
      { find: "@ux-sting/tokens", replacement: `${pkg("tokens")}/index.ts` },
      { find: "@ux-sting/themes", replacement: `${pkg("themes")}/index.ts` },
      { find: "@ux-sting/utils", replacement: `${pkg("utils")}/index.ts` },
      { find: "@ux-sting/hooks", replacement: `${pkg("hooks")}/index.ts` },
      { find: "@ux-sting/primitives", replacement: `${pkg("primitives")}/index.ts` },
      { find: "@ux-sting/icons", replacement: `${pkg("icons")}/index.ts` },
      { find: "@ux-sting/core", replacement: `${pkg("core")}/index.ts` },
      { find: "@ux-sting/react", replacement: `${pkg("react")}/index.ts` },
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
