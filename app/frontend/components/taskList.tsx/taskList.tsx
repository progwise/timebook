import React, { useRef } from 'react'
import { TaskFragment, useTaskCreateMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiTrash } from 'react-icons/bi'

export interface TaskListProps {
  tasks: TaskFragment[]
  projectId: string
}
export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks, projectId } = props
  const taskNameInputReference = useRef<HTMLInputElement>(null)
  const [, taskCreate] = useTaskCreateMutation()

  const handleAddTask = async () => {
    const title = taskNameInputReference.current?.value
    if (!title || title.length < 3) {
      console.error('text not set')
      return
    }

    try {
      const result = await taskCreate({
        data: {
          projectId: Number.parseInt(projectId),
          title,
        },
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
    } catch {}
  }

  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <th>Tasks</th>
          <th className="text-center">Billable / Hourly rate</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <Button variant="secondarySlim" tooltip="Delete task">
                <BiTrash />
              </Button>
              <span className="ml-2">{task.title}</span>
            </td>
            <td className="text-center">
              <input type="checkbox" />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>
            <input type="text" ref={taskNameInputReference} />
            <Button onClick={handleAddTask} variant="primarySlim">
              Add task
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
