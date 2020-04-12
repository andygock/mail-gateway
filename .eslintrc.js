module.exports = {
  env: {
    node: true,
    browser: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      arrowFunctions: true,
    },
  },
  extends: 'eslint:recommended',
  rules: {
    'no-unused-vars': 0,
  },
  plugins: [],
};
