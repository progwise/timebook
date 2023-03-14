/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/prefer-module */

require('@testing-library/jest-dom')
require('whatwg-fetch')
require('intersection-observer')

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub' // whatever
  },
}))

jest.mock('next/router', () => require('next-router-mock'))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: undefined,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
