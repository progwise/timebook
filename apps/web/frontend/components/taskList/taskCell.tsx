import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
import { CgSpinner } from 'react-icons/cg'

import { Button, InputField } from '@progwise/timebook-ui'

import { TaskFragment, useTaskUpdateMutation } from '../../generated/graphql'
import { DeleteTaskModal } from '../deleteTaskModal'
import { TaskFormData, taskInputSchema } from './taskList'

interface TaskCellProps {
  task: TaskFragment
  canDelete?: boolean
}

export const TaskCell = ({ task, canDelete }: TaskCellProps) => {
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
    resolver: yupResolver(taskInputSchema),
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
    <>
      {canDelete && (
        <Button ariaLabel="Delete Task" variant="danger" tooltip="Delete Task" onClick={() => setOpenDeleteModal(true)}>
          <BiTrash />
        </Button>
      )}

      <div className="flex flex-col ml-2">
        <span className="flex flex-row gap-2">
          <InputField
            variant="primary"
            {...register('title', { required: true })}
            onBlur={handleSubmit(handleSubmitTask)}
          />
          {fetching && <CgSpinner className="inline h-8 w-8 animate-spin dark:text-blue-600" />}
        </span>
        <br />

        <ErrorMessage errors={errors} name="title" as={<span role="alert" className="text-red-700" />} />
      </div>

      {openDeleteModal && (
        // eslint-disable-next-line unicorn/no-useless-undefined
        <DeleteTaskModal open onClose={() => setOpenDeleteModal(false)} task={task} />
      )}
    </>
  )
}
