import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'

import { Button, InputField } from '@progwise/timebook-ui'

import { TaskFragment, useTaskUpdateMutation } from '../../generated/graphql'
import { DeleteTaskModal } from '../deleteTaskModal'
import { TaskFormData, taskInputSchema } from './taskList'

interface TaskCellProps {
  task: TaskFragment & { canModify: boolean }
}

export const TaskCell = ({ task }: TaskCellProps) => {
  const [{ fetching }, taskUpdate] = useTaskUpdateMutation()
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    mode: 'onChange',
    defaultValues: {
      title: task.title,
    },
    resolver: zodResolver(taskInputSchema),
  })

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const handleSubmitTask = async (taskData: TaskFormData) => {
    const result = await taskUpdate({
      id: task.id,
      data: {
        projectId: task.project.id,
        title: taskData.title,
      },
    })

    if (result.error) setError('title', { message: 'Network error' })
  }

  return (
    <form className="flex w-full gap-4">
      <InputField
        variant="primary"
        {...register('title', { required: true })}
        onBlur={handleSubmit(handleSubmitTask)}
        loading={fetching}
        errorMessage={errors.title?.message}
      />
      {task.canModify && (
        <Button
          ariaLabel="Delete Task"
          variant="danger"
          className="w-[90px]"
          tooltip="Delete Task"
          onClick={() => setOpenDeleteModal(true)}
        >
          <BiTrash />
        </Button>
      )}
      {openDeleteModal && <DeleteTaskModal open onClose={() => setOpenDeleteModal(false)} task={task} />}
    </form>
  )
}
