import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  stylistic: {
    semi: true,
    indent: 2,
    quotes: "double",
  },
  imports: true,
  unicorn: true,
  typescript: {
    overrides: {
      "ts/consistent-type-imports": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-named-imports": "off",
      "unicorn/prefer-node-protocol": "off",
      "style/arrow-parens": "warn",
    },
  },
  react: {
    overrides: {
      "react-refresh/only-export-components": "off",
      "react/no-array-index-key": "off",
      "no-alert": "off",
      "react-hooks-extra/no-direct-set-state-in-use-effect": "off",
    },
  },
  javascript: true,
  jsonc: false,
  markdown: false,
  toml: false,
});
