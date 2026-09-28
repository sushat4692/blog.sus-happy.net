import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: [
            "dist/",
            ".astro/",
            ".vercel/",
            "node_modules/",
            "src/env.d.ts",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...eslintPluginAstro.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
    {
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/ban-ts-comment": "off",
            "no-console":
                process.env.NODE_ENV === "production" ? "error" : "off",
            "no-debugger":
                process.env.NODE_ENV === "production" ? "error" : "off",
        },
    },
    // Formatting is handled by Prettier; this disables ESLint rules that conflict.
    eslintConfigPrettier,
);
