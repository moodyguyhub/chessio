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
    // Design assets (vendor UI kits, extracted zips)
    "design/**",
  ]),
  // Chessio infra rules
  {
    rules: {
      // Block imports from @vercel/* packages (Edge SDK, KV, etc.)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@vercel/*"],
              message:
                "Importing from @vercel/* is not allowed. See INFRA_NOTES.md for details.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
