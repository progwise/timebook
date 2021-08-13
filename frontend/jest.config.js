// jest.config.ts

/* eslint-disable unicorn/prefer-module */

// Or async function
module.exports = async () => {
    return {
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
    }
}
