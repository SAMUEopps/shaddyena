import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Turn off or relax strict TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Allow using <img> instead of next/image
      "@next/next/no-img-element": "off",

      // Relax React rules
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "off",

      // Relax variable rules
      "prefer-const": "off",

      // (Optional) completely disable all errors to allow deploy
      // "all": "warn"
    },
  },
];

export default eslintConfig;
