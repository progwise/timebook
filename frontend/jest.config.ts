// jest.config.ts
import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
};
// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.jest.json'
      }
    },
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest-setup.ts']
  };
};