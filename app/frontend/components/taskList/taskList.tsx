import { ProjectFragment, TaskFragment, TaskInput, useTaskCreateMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiTrash } from 'react-icons/bi'
import { InputField } from '../inputField/inputField'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { DeleteTaskModal } from '../deleteTaskModal'
import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { TaskDetailsModal, taskInputSchema } from '../../../frontend/components/taskDetailsModal'
import {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
  TableFootRow,
} from '../table/table'

export interface TaskListProps {
  tasks: (TaskFragment & { canModify: boolean })[]
  project: ProjectFragment & { canModify: boolean }
  className?: string
}

type TaskFormData = Pick<TaskInput, 'title'>

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks, project, className } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TaskFormData>({ resolver: yupResolver(taskInputSchema) })
  const [, taskCreate] = useTaskCreateMutation()
  const [taskToBeDeleted, setTaskToBeDeleted] = useState<TaskFragment | undefined>()
  const [taskToBeUpdated, setTaskToBeUpdated] = useState<TaskFragment | undefined>()

  const handleAddTask = async (taskData: TaskFormData) => {
    try {
      const result = await taskCreate({
        data: {
          projectId: project.id,
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
    <section className={className}>
      <Table className="min-w-full  dark:bg-slate-800">
        <TableHead>
          <TableHeadRow>
            <TableHeadCell>Tasks</TableHeadCell>
            <TableHeadCell className="text-center">Billable / Hourly rate</TableHeadCell>
            <TableHeadCell>Details page</TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="mt-1 flex items-center">
                {task.canModify && (
                  <Button
                    ariaLabel="Delete Task"
                    variant="danger"
                    tooltip="Delete Task"
                    onClick={() => setTaskToBeDeleted(task)}
                  >
                    <BiTrash />
                  </Button>
                )}
                <span className="ml-2">{task.title}</span>
              </TableCell>
              <TableCell className="text-center">
                <input type="checkbox" />
              </TableCell>
              <TableCell>
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setTaskToBeUpdated(task)
                  }}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {taskToBeUpdated ? (
            // eslint-disable-next-line unicorn/no-useless-undefined
            <TaskDetailsModal task={taskToBeUpdated} onClose={() => setTaskToBeUpdated(undefined)} />
          ) : undefined}
          {taskToBeDeleted ? (
            // eslint-disable-next-line unicorn/no-useless-undefined
            <DeleteTaskModal open onClose={() => setTaskToBeDeleted(undefined)} task={taskToBeDeleted} />
          ) : undefined}
        </TableBody>
        {project.canModify && (
          <TableFoot>
            <TableFootRow>
              <TableCell>
                <form className="flex items-start gap-4" onSubmit={handleSubmit(handleAddTask)}>
                  <div className="flex flex-col">
                    <InputField
                      errorMessage={errors.title?.message}
                      variant="primary"
                      placeholder="Enter Taskname"
                      className=" dark:bg-slate-800 dark:text-white "
                      {...register('title')}
                    />
                  </div>

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
