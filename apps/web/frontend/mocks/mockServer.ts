import { setupServer } from 'msw/node'

import { accessTokenHandlers } from './accessTokenHandlers'
import { organizationHandlers } from './organizationHandlers'
import { projectHandlers } from './projectHandlers'
import { taskHandlers } from './taskHandlers'
import { workhourHandlers } from './workhourHandlers'

const allHandlers = [
  ...workhourHandlers,
  ...projectHandlers,
  ...taskHandlers,
  ...accessTokenHandlers,
  ...organizationHandlers,
]
export const mockServer = setupServer(...allHandlers)

beforeAll(() =>
  // eslint-disable-next-line no-console
  mockServer.listen({ onUnhandledRequest: async (request) => console.error('unhandled', await request.json()) }),
)
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
