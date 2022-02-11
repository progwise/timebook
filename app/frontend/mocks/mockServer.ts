import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { projectHandlers } from './projectHandlers'
import { workhourHandlers } from './workhourHandlers'

const allHandlers = [...handlers, ...workhourHandlers, ...projectHandlers]
export const mockServer = setupServer(...allHandlers)

// eslint-disable-next-line no-console
beforeAll(() => mockServer.listen({ onUnhandledRequest: (request) => console.error('unhandled', request) }))
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
