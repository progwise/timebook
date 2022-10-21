import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jestSetup.ts'],
}

export default config
