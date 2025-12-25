/**
 * Jest Configuration for Prismocker
 *
 * Moved to .trunk/configs/ for Trunk integration
 *
 * Test files should be co-located with source files using *.test.ts naming.
 * Example: client.ts → client.test.ts (same directory)
 */

module.exports = {
  // CRITICAL: Set rootDir to project root (not .trunk/configs/)
  // This ensures all path mappings work correctly
  rootDir: '../..',
  
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/src/**/*.test.ts',
    // Exclude example files - they're documentation, not actual tests
    '!**/examples/**/*.test.ts',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/examples/',
  ],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          target: 'ES2022',
          module: 'commonjs',
          moduleResolution: 'node',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          allowImportingTsExtensions: false,
        },
      },
    ],
  },
  // CRITICAL: Map .js imports to .ts files
  // TypeScript allows .js extensions in imports for ESM compatibility,
  // but Jest needs to resolve them to actual .ts source files
  moduleNameMapper: {
    // Map .js imports within src/ to .ts files
    '^(\\.\\.?/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
    '!src/bin/**',
  ],
  transformIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],
  // Increase test timeout for complex operations
  testTimeout: 10000,
  
  // JUnit XML reporter for Trunk Flaky Tests integration
  // Outputs test results in JUnit XML format for Trunk cloud analysis
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '../../.trunk/test-results/jest',
        outputName: 'junit.xml',
        addFileAttribute: 'true',
        reportTestSuiteErrors: 'true',
        suiteName: 'Jest Tests',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
};

