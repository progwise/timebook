import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const mockServer = setupServer(...handlers)

beforeAll(() => mockServer.listen())
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())
