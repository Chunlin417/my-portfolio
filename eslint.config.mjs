import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/*
 * eslint-config-next 16 ships native flat config, so it is spread directly.
 * Loading it through @eslint/eslintrc's FlatCompat (as this file used to)
 * feeds a flat-config array into the legacy eslintrc validator, which then
 * crashes serializing the plugin graph:
 *   TypeError: Converting circular structure to JSON
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "out/**", "node_modules/**", "legacy-vite/**"],
  },
];

export default eslintConfig;
