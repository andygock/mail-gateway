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
  extends: ['react-app', 'airbnb', 'prettier'],
  rules: {
    'comma-dangle': 0,
    'jsx-a11y/label-has-for': 0,
    'no-alert': 0,
    'no-console': 0, // remove this for production!
    'no-prototype-builtins': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    'no-useless-constructor': 0,
    'prefer-destructuring': 0,
    'react/destructuring-assignment': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-array-index-key': 0,
    'react/no-did-mount-set-state': 0,
    'react/no-unused-prop-types': 0,
    'react/no-unused-state': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
  },
  plugins: ['react'],
};
