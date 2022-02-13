import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import { taskHandlers } from './taskHandlers'

export const mockServer = setupServer(...handlers, ...taskHandlers)

beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
