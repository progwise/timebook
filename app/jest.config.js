/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

// Or async function
module.exports = {
  projects: [
    {
      globals: {
        'ts-jest': {
          tsconfig: 'tsconfig.jest.json',
        },
      },
      verbose: true,
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
      transform: {
        '.+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
      },
      displayName: { name: 'frontend', color: 'cyanBright' },
      roots: ['<rootDir>/frontend/', '<rootDir>/pages/'],
    },
    {
      displayName: { name: 'backend', color: 'magentaBright' },
      preset: 'ts-jest',
      testEnvironment: path.join(__dirname, './backend/prisma/prismaJestEnvironment.js'),
      roots: ['<rootDir>/backend/'],
      verbose: true,
    },
  ],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/.next/**', '!**/seed.ts'],
}
