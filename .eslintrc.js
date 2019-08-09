module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: true,
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'vue',
    'pug',
    '@typescript-eslint'
  ],
  // add your custom rules here
  rules: {
    'no-unused-variable': false,
    'no-unused-vars': 'off',
    'no-dupe-class-members': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_'}],
    'prettier/prettier': [
      'error', {
        'singleQuote': true,
        'semi': false,
        'printWidth': 120,
        'tabWidth': 2
      }
    ]
  }
}
