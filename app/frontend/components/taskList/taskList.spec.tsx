import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'
import { ProjectFragment, TaskFragment } from '../../generated/graphql'
import { TaskList } from './taskList'

import '../../mocks/mockServer'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

const tasks: TaskFragment[] = [
  {
    id: '1',
    hasWorkHours: false,
    canModify: true,
    title: 'Task 1',
    project: {
      id: '1',
      title: 'Project 1',
    },
  },
]

const project: ProjectFragment = {
  id: '1',
  title: 'Project 1',
  canModify: true,
  tasks: [],
}

describe('TaskList', () => {
  it('should display tasks', () => {
    render(<TaskList tasks={tasks} project={project} />, { wrapper })

    const taskTitle = screen.getByText('Task 1')
    expect(taskTitle).toBeInTheDocument()
  })

  it('should be possible to delete a task', async () => {
    render(<TaskList tasks={tasks} project={project} />, { wrapper })

    const deleteButton = screen.getByRole('button', { name: 'Delete Task' })
    expect(deleteButton).toBeInTheDocument()
    userEvent.click(deleteButton)

    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' })
    userEvent.click(confirmDeleteButton)

    await waitForElementToBeRemoved(confirmDeleteButton)
  })

  describe('Task form', () => {
    it('should display an error message when submitting a new task with less then 4 characters', async () => {
      render(<TaskList tasks={tasks} project={project} />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'Add task' })
      const titleInput = screen.getByPlaceholderText('Enter Taskname')

      userEvent.type(titleInput, 'abc')
      userEvent.click(submitButton)

      const errorMessage = await screen.findByText('Four characters needed')
      expect(errorMessage).toBeInTheDocument()
    })

    it('should submit a new task to the backend and clean the form', async () => {
      render(<TaskList tasks={tasks} project={project} />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'Add task' })
      const titleInput = screen.getByPlaceholderText('Enter Taskname')

      userEvent.type(titleInput, 'New Task')
      userEvent.click(submitButton)

      await waitFor(() => expect(titleInput).toHaveValue(''))
    })
  })
})
