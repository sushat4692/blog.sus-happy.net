module.exports = {
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    proseWrap: "preserve",
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
};
