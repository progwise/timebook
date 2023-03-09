import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import '../../mocks/mockServer'
import { TaskRow, TaskRowFragment } from './taskRow'

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

const testTask = makeFragmentData(
  {
    id: 'task1',
    title: 'Task 1',
    canModify: true,
  },
  TaskRowFragment,
)

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { teamSlug: 'slug', id: 'cl8vo1og70652rsesjielo9t6' },
      isReady: true,
      push: jest.fn(),
    }
  },
}))

describe('TaskCell', () => {
  it('should be validation errors', async () => {
    render(<TaskRow task={testTask} />, { wrapper })

    const textBox = await screen.findByRole('textbox')

    await userEvent.clear(textBox)
    expect(await screen.findByRole('alert')).toBeInTheDocument()

    await userEvent.type(textBox, '2')
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })
  it('should be success', async () => {
    render(<TaskRow task={testTask} />, { wrapper })

    const textBox = await screen.findByRole('textbox')

    await userEvent.clear(textBox)
    await userEvent.type(textBox, '2123123')
    await userEvent.click(document.body)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should be possible to delete a task', async () => {
    render(<TaskRow task={testTask} />, { wrapper })

    const deleteButton = screen.getByRole('button', { name: 'Delete Task' })
    expect(deleteButton).toBeInTheDocument()
    await userEvent.click(deleteButton)

    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' })
    await userEvent.click(confirmDeleteButton)

    await waitForElementToBeRemoved(confirmDeleteButton)
  })
})
