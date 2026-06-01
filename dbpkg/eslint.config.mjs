import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-nocheck": true, // Keeps banning @ts-nocheck (good practice)
          "ts-expect-error": false, // Allows you to use // @ts-expect-error safely
          "ts-ignore": "allow-with-description", // Allows // @ts-ignore ONLY if you leave a description
          "ts-check": false,
        },
      ],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
