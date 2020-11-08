module.exports = {
  future: {
    purgeLayersByDefault: true,
  },
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === "production",
    content: [
      "assets/**/*.css",
      "components/**/*.css",
      "pages/**/*.css",
      "templates/**/*.css",
    ],
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
}
