import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'
import { testTask } from '../../mocks/testData'
import { TaskCell } from './taskCell'

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { teamSlug: 'slug', id: 'cl8vo1og70652rsesjielo9t6' },
      isReady: true,
      push: jest.fn(),
    }
  },
}))

describe('test row', () => {
  it('should be validation errors', async () => {
    render(<TaskCell task={testTask} />, { wrapper })

    const textBox = await screen.findByRole('textbox')

    await userEvent.clear(textBox)
    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await userEvent.type(textBox, '2')
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
  it('should be success', async () => {
    render(<TaskCell task={testTask} />, { wrapper })

    const textBox = await screen.findByRole('textbox')

    await userEvent.clear(textBox)
    await userEvent.type(textBox, '2123123')
    await userEvent.click(document.body)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
