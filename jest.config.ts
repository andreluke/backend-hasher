import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm', // Já habilita ESM automaticamente
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!nanoid|fastify)', // Incluir fastify caso esteja usando ES Modules no Node.js
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1', // Mapeia arquivos .js para .ts
  }
};

export default config;
