import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
  TableRow,
} from '@progwise/timebook-ui'
import { taskInputValidations } from '@progwise/timebook-validations'

import { ProjectFragment, TaskFragment, TaskInput, useTaskCreateMutation } from '../../generated/graphql'
import { TaskCell } from './taskCell'
import id from 'date-fns/esm/locale/id/index.js'

export type TaskFormData = Pick<TaskInput, 'hourlyRate' | 'title'>

export const taskInputSchema: z.ZodSchema<TaskFormData> = taskInputValidations.pick({ title: true, hourlyRate: true })

export interface TaskListProps {
  tasks: (TaskFragment & { canModify: boolean })[]
  project: ProjectFragment & { canModify: boolean }
  className?: string
}

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks, project, className } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TaskFormData>({ resolver: zodResolver(taskInputSchema) })
  // } = useForm<TaskFormData>()
  const [, taskCreate] = useTaskCreateMutation()

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
            <TableHeadCell className="text-center">Billable / Hourly rate</TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="mt-1 flex items-center">
                <TaskCell task={task} />
              </TableCell>
              {/* <TableCell className="text-center">{task.hourlyRate ?? 'No'}</TableCell> */}
              <TableCell>
                <InputField variant="primary" value={task.hourlyRate?.toString()} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {project.canModify && (
          <TableFoot>
            <TableFootRow>
              <TableCell>
                <form className="flex items-start gap-4" onSubmit={handleSubmit(handleAddTask)}>
                  <InputField
                    variant="primary"
                    placeholder="Enter Taskname"
                    className=" dark:bg-slate-800 dark:text-white"
                    {...register('title')}
                    errorMessage={errors.title?.message}
                  />
                  <InputField
                    variant="primary"
                    placeholder="Enter Hourly Rate"
                    className=" dark:bg-slate-800 dark:text-white"
                    // {...register('hourlyRate', { valueAsNumber: true })}
                    {...register('hourlyRate')}
                    errorMessage={errors.hourlyRate?.message}
                    type="number"
                  />
                  <Button variant="secondary" type="submit" disabled={isSubmitting}>
                    Add task
                  </Button>
                </form>
              </TableCell>
            </TableFootRow>
          </TableFoot>
        )}
      </Table>
    </section>
  )
}
