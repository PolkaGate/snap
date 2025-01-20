module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },

  extends: ['@metamask/eslint-config'],

  overrides: [
    {
      files: ['**/*.js', '**/*.cjs'],
      extends: ['@metamask/eslint-config-nodejs'],

      parserOptions: {
        ecmaVersion: 2020,
      },
    },

    {
      files: ['**/*.mjs'],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },

    {
      files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
      extends: ["@metamask/eslint-config-typescript"],
      rules: {
        // This allows importing the `Text` JSX component.
        "@typescript-eslint/no-shadow": [
          "error",
          {
            allow: ["Text"],
          },
        ],

        // Without the `allowAny` option, this rule causes a lot of false
        // positives.
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          {
            allowAny: true,
            allowBoolean: true,
            allowNumber: true,
          },
        ],
      },
    },

    {
      files: ['**/*.test.ts',"**/*.test.tsx", '**/*.test.js'],
      extends: ['@metamask/eslint-config-jest'],
      rules: {
        '@typescript-eslint/no-shadow': [
          'error',
          { allow: ['describe', 'expect', 'it'] },
        ],
        '@typescript-eslint/unbound-method': 'off',
        'no-console': 'off',
      },
    }
  ],
  ignorePatterns: [
    '!.prettierrc.js',
    '**/!.eslintrc.js',
    '**/dist*/',
    '**/*__GENERATED__*',
    '**/build',
    '**/public',
    '**/.cache',
    'packages/**',
  ],
};
