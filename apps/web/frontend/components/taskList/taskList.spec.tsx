import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import '../../mocks/mockServer'
import { TaskList, TaskListProjectFragment } from './taskList'
import { TaskRowFragment } from './taskRow'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

const project = makeFragmentData(
  {
    id: '1',
    canModify: true,
    tasks: [
      {
        id: '1',
        ...makeFragmentData(
          {
            id: '1',
            canModify: true,
            title: 'Task 1',
            isLockedByAdmin: false,
          },
          TaskRowFragment,
        ),
      },
    ],
  },
  TaskListProjectFragment,
)

describe('TaskList', () => {
  it('should display tasks', async () => {
    render(<TaskList project={project} />, { wrapper })
    const textBoxes = await screen.findAllByRole('textbox')

    expect(textBoxes[0]).toHaveDisplayValue('Task 1')
  })

  describe('Task form', () => {
    it('should display an error message when submitting a task without a title', async () => {
      render(<TaskList project={project} />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'add' })
      const titleInput = screen.getByPlaceholderText('Enter a new task name')

      await userEvent.type(titleInput, ' ')
      await userEvent.click(submitButton)

      const errorMessage = await screen.findByText('title must be at least 1 character')
      expect(errorMessage).toBeInTheDocument()
    })

    it('should submit a new task to the backend and clean the form', async () => {
      render(<TaskList project={project} />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'add' })
      const titleInput = screen.getByPlaceholderText('Enter a new task name')

      await userEvent.type(titleInput, 'New Task')
      await userEvent.click(submitButton)

      await waitFor(() => expect(titleInput).toHaveValue(''))
    })
  })
})
