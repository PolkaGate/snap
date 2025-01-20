module.exports = {
  preset: '@metamask/snaps-jest',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { isolatedModules: true, diagnostics: { warnOnly: true } }],
    '^.+\\.svg$': '<rootDir>/jest-mocks/jest-svg-transformer.js', // Add a transformer for SVG files
  },

  transformIgnorePatterns: [
    '/node_modules/', // Skip transforming node_modules
    'node_modules/(?!@metamask/snaps-sdk)', // Ensure snaps-sdk is not ignored
  ],
  modulePathIgnorePatterns: [
    '/node_modules/', // Ignore node_modules for module resolution
  ],
  moduleNameMapper: {
    '^@mangata-finance/type-definitions$': '<rootDir>/jest-mocks/mangataMock.js', // Mock mangata dependency
  },
};