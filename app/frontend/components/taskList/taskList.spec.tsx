import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'
import { TaskFragment } from '../../generated/graphql'
import { TaskList } from './taskList'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

const tasks: TaskFragment[] = [
  {
    id: '1',
    hasWorkHours: false,
    title: 'Task 1',
    project: {
      id: '1',
      title: 'Project 1',
    },
  },
]

describe('TaskList', () => {
  it('should display tasks', () => {
    render(<TaskList tasks={tasks} projectId="1" />, { wrapper })

    const taskTitle = screen.getByText('Task 1')
    expect(taskTitle).toBeInTheDocument()
  })

  // eslint-disable-next-line jest/expect-expect
  it('should redirect to details page when clicking details', () => {
    render(<TaskList tasks={tasks} projectId="1" />, { wrapper })
    const detailsButton = screen.getByRole('button', { name: 'Details' })

    // TODO: enabling this causes an error
    // userEvent.click(detailsButton)

    // TODO: check redirect
  })

  it.todo('should be possible to delete a task')

  describe('Task form', () => {
    it('should display an error message when submitting a new task with less then 4 characters', async () => {
      render(<TaskList tasks={tasks} projectId="1" />, { wrapper })

      const submitButton = screen.getByRole('button', { name: 'Add task' })
      const titleInput = screen.getByRole('textbox', { name: 'Taskname' })

      userEvent.type(titleInput, 'abc')
      userEvent.click(submitButton)

      const errorMessage = await screen.findByText('Four characters needed')
      expect(errorMessage).toBeInTheDocument()
    })

    it.todo('should submit a new task to the backend and clean the form')
  })
})
