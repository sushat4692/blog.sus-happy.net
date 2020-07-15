module.exports = {
  globals: {
    __PATH_PREFIX__: true,
  },
  extends: [
    `react-app`,
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'prettier'
  ],
}
