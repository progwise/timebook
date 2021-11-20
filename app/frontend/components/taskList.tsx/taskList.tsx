import { TaskFragment } from '../../generated/graphql'

export interface TaskListProps {
  tasks: TaskFragment[]
}
export const TaskList = (props: TaskListProps) => {
  const { tasks } = props
  return (
    <table>
      <thead>
        <th>Tasks</th>
        <th>Billable</th>
        <th>Hourly rate</th>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
