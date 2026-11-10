import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: { name: "@storybook/react-vite", options: {} },
  stories: ["../../../packages/react/src/**/*.stories.tsx", "../stories/*.stories.tsx"],
  addons: ["@storybook/addon-a11y", "storybook-addon-pseudo-states"],
  core: { disableTelemetry: true },
  typescript: { reactDocgen: false },
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // Generated demo stories import "@ux-sting/react/*". Resolve them to source so they share
    // React context (UIProvider, messages, portals) with the preview decorator.
    const src = fileURLToPath(new URL("../../../packages/react/src", import.meta.url));
    config.resolve ??= {};
    config.resolve.alias = [
      ...(Array.isArray(config.resolve.alias) ? config.resolve.alias : []),
      { find: /^@ux-sting\/react\/(.*)$/, replacement: `${src}/components/$1/index.ts` },
      { find: /^@ux-sting\/react$/, replacement: `${src}/index.ts` },
    ];
    return config;
  },
};

export default config;
