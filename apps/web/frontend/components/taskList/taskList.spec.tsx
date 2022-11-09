import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { ProjectWithTasksFragment, TaskFragment } from '../../generated/graphql'
import '../../mocks/mockServer'
import { TaskList } from './taskList'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

const tasks: (TaskFragment & { canModify: boolean })[] = [
  {
    id: '1',
    hasWorkHours: false,
    title: 'Task 1',
    project: {
      id: '1',
      title: 'Project 1',
      __typename: 'Project',
    },
    canModify: true,
    __typename: 'Task',
  },
]

const project: ProjectWithTasksFragment & { canModify: boolean } = {
  id: '1',
  title: 'Project 1',
  tasks: [],
  canModify: true,
  __typename: 'Project',
}

describe('TaskList', () => {
  it('should display tasks', async () => {
    render(<TaskList tasks={tasks} project={project} />, { wrapper })
    const textBoxes = await screen.findAllByRole('textbox')

    expect(textBoxes[0]).toHaveDisplayValue('Task 1')
  })

  describe('Task form', () => {
    it('should display an error message when submitting a new task with less then 4 characters', async () => {
      render(<TaskList tasks={tasks} project={project} />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'Add task' })
      const titleInput = screen.getByPlaceholderText('Enter Taskname')

      await userEvent.type(titleInput, 'abc')
      await userEvent.click(submitButton)

      const errorMessage = await screen.findByText('title must be at least 4 characters')
      expect(errorMessage).toBeInTheDocument()
    })

    it('should submit a new task to the backend and clean the form', async () => {
      render(<TaskList tasks={tasks} project={project} />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'Add task' })
      const titleInput = screen.getByPlaceholderText('Enter Taskname')

      await userEvent.type(titleInput, 'New Task')
      await userEvent.click(submitButton)

      await waitFor(() => expect(titleInput).toHaveValue(''))
    })
  })
})
