/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/prefer-module */

require('@testing-library/jest-dom')
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub' // whatever
  },
}))
