/** @type {import('jest').Config} */
const testMode = process.env.TEST_MODE;
const isSrc = testMode === "src";

module.exports = {
  verbose: true,
  resetMocks: true,
  verbose: true,
  collectCoverage: isSrc,
  coverageReporters: ["clover", "json", "lcov", "text"],
  testEnvironment: "jsdom",
  setupFiles: [],
  moduleNameMapper: {
    "storage-js": isSrc ? "<rootDir>/src" : "<rootDir>/dist",
  },
  transform: {
    ".*\\.(ts)$": [
      "ts-jest",
      {
        tsconfig: "./test/tsconfig.json",
      },
    ],
  },
};
