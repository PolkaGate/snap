module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },

  extends: ['@metamask/eslint-config'],

  overrides: [
    {
      files: ['**/*.js'],
      extends: ['@metamask/eslint-config-nodejs'],
    },

    {
      files: ["**/*.ts", "**/*.tsx"],
      extends: ["@metamask/eslint-config-typescript"],
      rules: {
        // This allows importing the `Text` JSX component.
        "@typescript-eslint/no-shadow": [
          "error",
          {
            allow: ["Text"],
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
  ],
};
