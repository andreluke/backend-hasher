import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: [
    'node_modules',  // Módulos de dependências
    '<rootDir>/src', // Só procurar por arquivos na pasta src
  ],
  moduleNameMapper: {
    '^<rootDir>/src/(.*)\\.js$': '<rootDir>/src/$1.ts', // Mapeia importações .js para .ts
  },
  transformIgnorePatterns: [
    '/node_modules/(?!nanoid)', // Permitir transformação do `nanoid`
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: '<rootDir>/coverage',
};

export default config;

