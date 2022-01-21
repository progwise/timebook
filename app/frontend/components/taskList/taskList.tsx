import { TaskFragment, useTaskCreateMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiTrash } from 'react-icons/bi'
import { InputField } from '../inputField/inputField'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { DeleteTaskModal } from '../deleteTaskModal'
import { useState } from 'react'
import { useRouter } from 'next/router'

export interface TaskListProps {
  tasks: TaskFragment[]
  projectId: string
}
interface TaskForm {
  title: string
}

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks, projectId } = props
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TaskForm>()
  const [, taskCreate] = useTaskCreateMutation()
  const [taskToBeDeleted, setTaskToBeDeleted] = useState<TaskFragment | undefined>()

  const handleTaskDetails = async (tasks: TaskFragment) => {
    await router.push(`/${router.query.teamSlug}/tasks/${tasks.id}`)
  }

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
          <th>Details page</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <Button variant="secondarySlim" tooltip="Delete Task" onClick={() => setTaskToBeDeleted(task)}>
                <BiTrash />
              </Button>
              <span className="ml-2">{task.title}</span>
            </td>
            <td className="text-center">
              <input type="checkbox" />
            </td>
            <td>
              <Button variant="primarySlim" onClick={() => handleTaskDetails(task)}>
                Details
              </Button>
            </td>
          </tr>
        ))}
        {taskToBeDeleted ? (
          // eslint-disable-next-line unicorn/no-useless-undefined
          <DeleteTaskModal open onClose={() => setTaskToBeDeleted(undefined)} task={taskToBeDeleted} />
        ) : undefined}
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
