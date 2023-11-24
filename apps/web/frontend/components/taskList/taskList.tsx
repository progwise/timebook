import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
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
  const { register, handleSubmit, reset, formState, control } = useForm<TaskFormData>({
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
            <tr>
              <td className="p-1 pt-1">
                <form
                  className="flex items-start gap-4 font-normal"
                  onSubmit={handleSubmit(handleAddTask)}
                  id="form-create-task"
                >
                  <InputField
                    type="text"
                    placeholder="Enter a new task name"
                    {...register('title')}
                    errorMessage={errors.title?.message}
                    isDirty={isDirty && dirtyFields.title}
                  />
                </form>
              </td>
              <td className="w-px">
                <Controller
                  control={control}
                  name="isLocked"
                  render={({ field: { onChange, value } }) => (
                    <input
                      type="checkbox"
                      checked={value ?? false}
                      onChange={onChange}
                      className="toggle toggle-warning"
                    />
                  )}
                />
              </td>
              <td className="w-px">
                <button
                  className="btn btn-primary btn-sm w-full"
                  type="submit"
                  disabled={isSubmitting}
                  form="form-create-task"
                >
                  Add
                </button>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}
