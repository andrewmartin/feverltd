module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:@typescript-eslint/recommended',
      'airbnb-base',
      'prettier',
      'plugin:prettier/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier/@typescript-eslint',
    ],
    env: {
      jest: true,
      browser: true,
      es6: true,
      node: true,
    },
    plugins: ['prettier', '@typescript-eslint', 'react-hooks'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 0,
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      'consistent-return': 0,
      'import/prefer-default-export': 0,
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'no-console': 2,
      'no-unused-vars': [
        2,
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      'react/prop-types': 0,
      camelcase: 0,
    },
  }
