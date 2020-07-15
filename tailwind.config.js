module.exports = {
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === "production",
    content: [
      "src/assets/**/*.css",
      "src/components/**/*.css",
      "src/pages/**/*.css",
      "src/templates/**/*.css",
    ],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
