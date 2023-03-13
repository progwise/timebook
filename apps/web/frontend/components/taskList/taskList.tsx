import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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

export type TaskFormData = Pick<TaskInput, 'hourlyRate' | 'title'>

export const taskInputSchema: z.ZodSchema<TaskFormData> = taskInputValidations.pick({ title: true, hourlyRate: true })

export interface TaskListProps {
  project: FragmentType<typeof TaskListProjectFragment>
  className?: string
}

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { className } = props
  const project = useFragment(TaskListProjectFragment, props.project)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TaskFormData>({ resolver: zodResolver(taskInputSchema) })
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
      <Table className="min-w-full  dark:bg-slate-800">
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Tasks</TableHeadCell>
            <TableHeadCell>Billable / Hourly rate</TableHeadCell>
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
                    placeholder="Enter Taskname"
                    className=" dark:bg-slate-800 dark:text-white"
                    {...register('title')}
                    errorMessage={errors.title?.message}
                  />
                </form>
              </TableCell>
              <TableCell>
                <InputField
                  variant="primary"
                  placeholder="Enter Hourly Rate"
                  className=" dark:bg-slate-800 dark:text-white"
                  {...register('hourlyRate')}
                  errorMessage={errors.hourlyRate?.message}
                  type="number"
                  form="form-create-task"
                />
              </TableCell>
              <TableCell>
                <Button variant="secondary" type="submit" disabled={isSubmitting} form="form-create-task">
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
