import { TaskFragment, TaskInput, useTaskCreateMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { BiEdit, BiMessageAdd, BiTrash } from 'react-icons/bi'
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
    <section className="flex gap-2 flex-col">
      <h2>Tasks</h2>
      {currentTask ? (
        // eslint-disable-next-line unicorn/no-useless-undefined
        <TaskDetailsModal open task={currentTask} onClose={() => setCurrentTask(undefined)} />
      ) : undefined}
      {tasks.map((task, index) => (
        <article key={task.id} className="grid gap-0 border-2 border-r-8 p-2 grid-flow-col">
          <h2 className="text-xl">{task.title}</h2>
          <p>{`${index + 1}. task of project ${task.project.title}`}</p>
          <div className="flex row-span-2 gap-4 justify-end">
            <Button
              variant="primarySlim"
              onClick={() => {
                setCurrentTask(task)
              }}
            >
              <BiEdit />
              Edit
            </Button>
            <Button
              variant="danger"
              tooltip="Delete Task"
              onClick={() => setTaskToBeDeleted(task)}
            >
              <BiTrash />
              Delete
            </Button>
          </div>

        </article>
      ))}
          
        
          {taskToBeDeleted ? (
            // eslint-disable-next-line unicorn/no-useless-undefined
            <DeleteTaskModal open onClose={() => setTaskToBeDeleted(undefined)} task={taskToBeDeleted} />
          ) : undefined}
       <article className="border-2 border-r-8 p-2 mt-4">
         <form className="grid grid-flow-col" onSubmit={handleSubmit(handleAddTask)}>
           <h2 className="text-xl col-start-1">
            <InputField
              className="text-xl"
              variant="primary"
              placeholder="Enter name of new task"
              {...register('title', { required: 'Four characters needed', minLength: 4 })}
            />
           </h2>
           <ErrorMessage errors={errors} name="title" as={<span className="text-red-700 col-start-1" />} />
           <p className="col-start-1">Create new task</p>
           <div className="col-start-2 row-span-3 flex justify-end">
            <Button variant="primarySlim" type="submit" disabled={isSubmitting}>  
              <BiMessageAdd />
              Add
            </Button>
           </div>
        </form>
      </article>
    </section>
  )
}
