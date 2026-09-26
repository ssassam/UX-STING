import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/storybook-static/**", "**/*.d.ts", "packages/icons/src/icons/**", "packages/cli/templates/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      // Components forward arbitrary ARIA/handlers; these rules misfire on primitives that receive them via props.
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["region", "tabpanel", "alert", "separator"], tags: ["main", "li", "section", "pre"] }],
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/heading-has-content": "off",
      "jsx-a11y/role-has-required-aria-props": "off",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.stories.tsx"],
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: { globals: { ...globals.node } },
  },
);
