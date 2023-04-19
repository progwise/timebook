import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { z } from 'zod'

import {
  Button,
  InputField,
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableFootRow,
  TableHead,
  TableHeadCell,
  TableHeadRow,
} from '@progwise/timebook-ui'
import { taskInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TaskInput } from '../../generated/gql/graphql'
import { LockSwitch } from './lockSwitch'
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

export type TaskFormData = Pick<TaskInput, 'hourlyRate' | 'title' | 'isLocked'>

export const taskInputSchema: z.ZodSchema<TaskFormData> = taskInputValidations.pick({
  title: true,
  hourlyRate: true,
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
    defaultValues: { title: '', hourlyRate: undefined },
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
    <section className={className}>
      <Table className="min-w-full dark:bg-slate-800">
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Tasks</TableHeadCell>
            <TableHeadCell>Billable / Hourly rate</TableHeadCell>
            <TableHeadCell>Locked</TableHeadCell>
            <TableHeadCell />
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {project.tasks.map((task) => (
            <TaskRow task={task} key={task.id} />
          ))}
        </TableBody>
        {project.canModify && (
          <TableFoot>
            <TableFootRow>
              <TableCell>
                <form className="flex items-start gap-4" onSubmit={handleSubmit(handleAddTask)} id="form-create-task">
                  <InputField
                    variant="primary"
                    placeholder="Enter task name"
                    className="dark:bg-slate-800 dark:text-white"
                    {...register('title')}
                    errorMessage={errors.title?.message}
                    isDirty={isDirty && dirtyFields.title}
                  />
                </form>
              </TableCell>
              <TableCell>
                <InputField
                  variant="primary"
                  placeholder="Enter hourly rate"
                  className="dark:bg-slate-800 dark:text-white"
                  {...register('hourlyRate')}
                  errorMessage={errors.hourlyRate?.message}
                  type="number"
                  form="form-create-task"
                  isDirty={isDirty && dirtyFields.hourlyRate}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name="isLocked"
                  render={({ field: { onChange, value } }) => (
                    <LockSwitch locked={value ?? false} onChange={onChange} />
                  )}
                />
              </TableCell>
              <TableCell>
                <Controller
                  control={control}
                  name="isLocked"
                  render={({ field: { onChange, value } }) => (
                    <LockSwitch locked={value ?? false} onChange={onChange} />
                  )}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="secondary"
                  className="h-8"
                  type="submit"
                  disabled={isSubmitting}
                  form="form-create-task"
                >
                  Add task
                </Button>
              </TableCell>
            </TableFootRow>
          </TableFoot>
        )}
      </Table>
    </section>
  )
}
