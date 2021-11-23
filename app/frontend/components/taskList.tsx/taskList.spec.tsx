import { render, screen } from '@testing-library/react'
import { TaskFragment } from '../../generated/graphql'
import { TaskList } from './taskList'

describe('the tasklist should ...', () => {
  const testTasks: TaskFragment[] = []
  beforeEach(() => {
    render(<TaskList projectId="1" tasks={testTasks} />)
  })

  it('...have a column header "tasks"', () => {
    const columnHeader = screen.getByRole('columnheader', {
      name: /tasks/i,
    })
    expect(columnHeader).toBeVisible()
  })
  it('...has an input box for new task titles', () => {
    const textbox = screen.getByRole('textbox')
    expect(textbox).toBeEnabled()
  })
  it('...has a button to add tasks', () => {
    const button = screen.getByRole('button', {
      name: /add task/i,
    })
    expect(button).toBeEnabled()
  })
})
