import { setupServer } from 'msw/node'

import { projectHandlers } from './projectHandlers'
import { taskHandlers } from './taskHandlers'
import { workhourHandlers } from './workhourHandlers'

const allHandlers = [...workhourHandlers, ...projectHandlers, ...taskHandlers]
export const mockServer = setupServer(...allHandlers)

// eslint-disable-next-line no-console
beforeAll(() => mockServer.listen({ onUnhandledRequest: (request) => console.error('unhandled', request) }))
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
