import { TaskFragment, useTaskCreateMutation, useTaskDeleteMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiTrash } from 'react-icons/bi'
import { InputField } from '../inputField/inputField'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'

export interface TaskListProps {
  tasks: TaskFragment[]
  projectId: string
}
export interface TaskForm {
  title: string
}

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks, projectId } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TaskForm>()
  const [, taskCreate] = useTaskCreateMutation()
  const [, taskDelete] = useTaskDeleteMutation()

  const handleAddTask = async (taskData: TaskForm) => {
    try {
      const result = await taskCreate({
        data: {
          projectId: Number.parseInt(projectId),
          title: taskData.title,
        },
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
      reset()
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
              <Button variant="secondarySlim" tooltip="Delete task" onClick={() => taskDelete({ id: task.id })}>
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
            <form className="flex items-start gap-4" onSubmit={handleSubmit(handleAddTask)}>
              <div className="flex flex-col">
                <label>
                  <InputField
                    variant="primary"
                    placeholder="Enter Taskname"
                    {...register('title', { required: 'Four characters needed', minLength: 4 })}
                  />
                </label>
                <ErrorMessage errors={errors} name="title" as={<span className="text-red-700" />} />
              </div>

              <Button variant="primarySlim" type="submit" disabled={isSubmitting}>
                Add task
              </Button>
            </form>
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
