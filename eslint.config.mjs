import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Supplied design reference, not application source. It is kept in the
    // repo so the visual decisions stay traceable, but it is a third-party
    // export and is not held to this project's lint rules.
    "design/**",
  ]),
]);

export default eslintConfig;
