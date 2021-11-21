import React from 'react'
import { TaskFragment } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiTrash } from 'react-icons/bi'

export interface TaskListProps {
  tasks: TaskFragment[]
}
export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks } = props
  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th>Tasks</th>
          <th>Billable / Hourly rate</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <Button variant="primary">
                <BiTrash />
              </Button>
              {task.title}
            </td>
            <td>
              <input type="checkbox" />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <input type="text" />
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
