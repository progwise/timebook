import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa6'
import { useMutation } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { taskInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TaskInput } from '../../generated/gql/graphql'
import { TaskRow } from './taskRow'

export const TaskListProjectFragment = graphql(`
  fragment TaskListProject on Project {
    id
    canModify
    tasks {
      id
      ...TaskRow
    }
  }
`)

const TaskCreateMutationDocument = graphql(`
  mutation taskCreate($data: TaskInput!) {
    taskCreate(data: $data) {
      id
    }
  }
`)

export type TaskFormData = Pick<TaskInput, 'title' | 'isLocked'>

export const taskInputSchema: z.ZodSchema<TaskFormData> = taskInputValidations.pick({
  title: true,
  isLocked: true,
})

export interface TaskListProps {
  project: FragmentType<typeof TaskListProjectFragment>
  className?: string
}

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { className } = props
  const project = useFragment(TaskListProjectFragment, props.project)
  const { register, handleSubmit, reset, formState, setFocus } = useForm<TaskFormData>({
    resolver: zodResolver(taskInputSchema),
    defaultValues: { title: '' },
  })

  const { isSubmitting, errors, isDirty, dirtyFields } = formState

  const [, taskCreate] = useMutation(TaskCreateMutationDocument)

  const handleAddTask = async (taskData: TaskFormData) => {
    try {
      const result = await taskCreate({
        data: {
          projectId: project.id,
          ...taskData,
        },
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
      setFocus('title')
      reset()
    } catch {}
  }

  return (
    <div className={className}>
      <table className="table min-w-full [&_tr]:border-none">
        <thead>
          <tr className="font-normal">
            <td className="text-xl text-base-content">Tasks</td>
            {project.canModify && (
              <>
                <td className="w-px" />
                <td className="w-px" />
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {project.tasks.map((task) => (
            <TaskRow task={task} key={task.id} />
          ))}
        </tbody>
        {project.canModify && (
          <tfoot>
            <tr className="font-normal">
              <td className="p-1">
                <form onSubmit={handleSubmit(handleAddTask)} id="form-create-task">
                  <InputField
                    type="text"
                    placeholder="Enter a new task name"
                    {...register('title')}
                    errorMessage={errors.title?.message}
                    isDirty={isDirty && dirtyFields.title}
                  />
                </form>
              </td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  type="submit"
                  disabled={isSubmitting}
                  form="form-create-task"
                >
                  <FaPlus />
                </button>
              </td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
