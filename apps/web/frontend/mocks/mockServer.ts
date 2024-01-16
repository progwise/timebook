import { setupServer } from 'msw/node'

import { accessTokenHandlers } from './accessTokenHandlers'
import { projectHandlers } from './projectHandlers'
import { taskHandlers } from './taskHandlers'
import { workhourHandlers } from './workhourHandlers'

const allHandlers = [...workhourHandlers, ...projectHandlers, ...taskHandlers, ...accessTokenHandlers]
export const mockServer = setupServer(...allHandlers)

// eslint-disable-next-line no-console
beforeAll(() =>
  mockServer.listen({ onUnhandledRequest: async (request) => console.error('unhandled', await request.json()) }),
)
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
