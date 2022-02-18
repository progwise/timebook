import { TaskFragment, TaskInput, useTaskCreateMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiTrash } from 'react-icons/bi'
import { InputField } from '../inputField/inputField'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { DeleteTaskModal } from '../deleteTaskModal'
import { useState } from 'react'
import { TaskDetailsModal } from '../../../frontend/components/taskDetailsModal'
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
  tasks: TaskFragment[]
  projectId: string
}

export const TaskList = (props: TaskListProps): JSX.Element => {
  const { tasks, projectId } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<TaskInput>()
  const [, taskCreate] = useTaskCreateMutation()
  const [taskToBeDeleted, setTaskToBeDeleted] = useState<TaskFragment | undefined>()
  const [currentTask, setCurrentTask] = useState<TaskFragment | undefined>()

  const handleAddTask = async (taskData: TaskInput) => {
    try {
      const result = await taskCreate({
        data: {
          projectId,
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
    <>
      {currentTask ? (
        // eslint-disable-next-line unicorn/no-useless-undefined
        <TaskDetailsModal open task={currentTask} onClose={() => setCurrentTask(undefined)} />
      ) : undefined}
      <Table className="min-w-full">
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
                <Button
                  ariaLabel="Delete Task"
                  variant="secondarySlim"
                  tooltip="Delete Task"
                  onClick={() => setTaskToBeDeleted(task)}
                >
                  <BiTrash />
                </Button>
                <span className="ml-2">{task.title}</span>
              </TableCell>
              <TableCell className="text-center">
                <input type="checkbox" />
              </TableCell>
              <TableCell>
                <Button
                  variant="primarySlim"
                  onClick={() => {
                    setCurrentTask(task)
                  }}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {taskToBeDeleted ? (
            // eslint-disable-next-line unicorn/no-useless-undefined
            <DeleteTaskModal open onClose={() => setTaskToBeDeleted(undefined)} task={taskToBeDeleted} />
          ) : undefined}
        </TableBody>
        <TableFoot>
          <TableFootRow>
            <TableCell>
              <form className="flex items-start gap-4" onSubmit={handleSubmit(handleAddTask)}>
                <div className="flex flex-col">
                  <label>
                    <InputField
                      variant="primary"
                      placeholder="Enter Taskname"
                      {...register('title', {
                        required: 'Four characters needed',
                        minLength: { value: 4, message: 'Four characters needed' },
                      })}
                    />
                  </label>
                  <ErrorMessage errors={errors} name="title" as={<span className="text-red-700" />} />
                </div>

                <Button variant="primarySlim" type="submit" disabled={isSubmitting}>
                  Add task
                </Button>
              </form>
            </TableCell>
          </TableFootRow>
        </TableFoot>
      </Table>
    </>
  )
}
