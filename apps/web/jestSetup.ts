import '@testing-library/jest-dom'
import 'intersection-observer'
import resizeObserver from 'resize-observer-polyfill'
import 'whatwg-fetch'

global.ResizeObserver = resizeObserver

jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub' // whatever
  },
}))

// eslint-disable-next-line unicorn/prefer-module
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
