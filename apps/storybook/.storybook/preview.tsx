import type { Decorator, Preview } from "@storybook/react-vite";
import { UIProvider } from "../../../packages/react/src/provider/index.js";
import { Toaster } from "../../../packages/react/src/components/toast/index.js";
import { TooltipProvider } from "../../../packages/react/src/components/tooltip/index.js";
import "./styles.css";

const withUI: Decorator = (Story, context) => {
  const { theme, mode, density, locale } = context.globals as Record<string, string>;
  return (
    <UIProvider
      theme={theme ?? "default"}
      colorMode={(mode ?? "light") as "light"}
      density={(density ?? "comfortable") as "comfortable"}
      locale={locale ?? "en"}
      className="min-h-dvh p-6"
    >
      <TooltipProvider>
        <Story />
        <Toaster />
      </TooltipProvider>
    </UIProvider>
  );
};

const preview: Preview = {
  decorators: [withUI],
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
    controls: { expanded: true },
    viewport: {
      options: {
        mobile: { name: "Mobile 375", styles: { width: "375px", height: "740px" } },
        tablet: { name: "Tablet 768", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop 1280", styles: { width: "1280px", height: "800px" } },
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Theme preset",
      toolbar: { title: "Theme", icon: "paintbrush", items: ["default", "neutral", "modern", "compact", "soft", "high-contrast"], dynamicTitle: true },
    },
    mode: {
      description: "Color mode",
      toolbar: { title: "Mode", icon: "mirror", items: ["light", "dark", "high-contrast"], dynamicTitle: true },
    },
    density: {
      description: "Density",
      toolbar: { title: "Density", icon: "component", items: ["compact", "comfortable", "spacious"], dynamicTitle: true },
    },
    locale: {
      description: "Locale / direction",
      toolbar: {
        title: "Locale",
        icon: "globe",
        items: [
          { value: "en", title: "English (LTR)" },
          { value: "fr", title: "Français (LTR)" },
          { value: "ar", title: "العربية (RTL)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "default", mode: "light", density: "comfortable", locale: "en" },
};

export default preview;
