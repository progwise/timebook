import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: '<rootDir>/src/prisma/prismaJestEnvironment.js',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/seed.ts'],
}

export default config
