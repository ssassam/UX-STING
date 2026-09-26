import axe from "axe-core";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { UIProvider, type UIProviderProps } from "./provider/index.js";

export function renderWithProvider(
  ui: ReactElement,
  { providerProps, ...options }: RenderOptions & { providerProps?: UIProviderProps } = {},
) {
  return render(<UIProvider {...providerProps}>{ui}</UIProvider>, options);
}

/**
 * Runs axe-core against a container and fails with readable violations.
 * Color contrast is verified separately by token tests (jsdom cannot compute it).
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  const violations = results.violations.map(
    (v) => `${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.html).join("\n  ")}`,
  );
  if (violations.length) throw new Error(`Accessibility violations:\n${violations.join("\n")}`);
}
