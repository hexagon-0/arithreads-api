import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  clearMocks: true,
  collectCoverage: true,
  coverageProvider: "v8",
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  setupFilesAfterEnv: ["./tests/jest.setup.ts"],
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
};

export default config;
