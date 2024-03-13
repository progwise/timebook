import { setupServer } from 'msw/node'

import { accessTokenHandlers } from './accessTokenHandlers'
import { projectHandlers } from './projectHandlers'
import { taskHandlers } from './taskHandlers'
import { workHourHandlers } from './workHourHandlers'

const allHandlers = [...workHourHandlers, ...projectHandlers, ...taskHandlers, ...accessTokenHandlers]
export const mockServer = setupServer(...allHandlers)

beforeAll(() =>
  // eslint-disable-next-line no-console
  mockServer.listen({ onUnhandledRequest: async (request) => console.error('unhandled', await request.json()) }),
)
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
