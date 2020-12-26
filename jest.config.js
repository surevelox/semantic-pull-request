module.exports = {
    clearMocks: true,
    transform: {'^.+\\.ts?$': 'ts-jest'},
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.spec.[jt]s?(x)', '<rootDir>/__tests__/**/*.[jt]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testRunner: 'jest-circus/runner',
    verbose: true
  };