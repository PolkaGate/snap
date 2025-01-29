module.exports = {
  extends: ['../../.eslintrc.js'],

  ignorePatterns: ['!.eslintrc.js', 'dist/'],
  
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': [
          'error',
          {
            allow: ['Text'],
          },
        ],
      },
    },
  ],
};
