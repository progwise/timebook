import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'

import { Button, InputField, TableCell } from '@progwise/timebook-ui'

import { TaskFragment, TaskInput, TaskUpdateInput, useTaskUpdateMutation } from '../../generated/graphql'
import { DeleteTaskModal } from '../deleteTaskModal'
import { taskInputValidations } from '@progwise/timebook-validations'

interface TaskCellProps {
  task: TaskFragment & { canModify: boolean }
}

export const TaskCell = ({ task }: TaskCellProps) => {
  const [{ fetching: fetchingTitle }, updateTaskTitle] = useTaskUpdateMutation()
  const [{ fetching: fetchingHourlyRate }, updateHourlyRate] = useTaskUpdateMutation()
  const {
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<TaskUpdateInput, 'title'>>({
    mode: 'onChange',
    defaultValues: {
      title: task.title,
    },
    resolver: zodResolver(taskInputValidations.pick({ title: true })),
  })

  const hourlyRateForm = useForm<Pick<TaskUpdateInput, 'hourlyRate'>>({
    mode: 'onChange',
    defaultValues: {
      hourlyRate: task.hourlyRate,
    },
    resolver: zodResolver(taskInputValidations.pick({ hourlyRate: true })),
  })

  hourlyRateForm.formState.errors

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const handleTitleSubmit = async (taskData: Pick<TaskUpdateInput, 'title'>) => {
    const result = await updateTaskTitle({
      id: task.id,
      data: {
        // projectId: task.project.id,
        title: taskData.title,
      },
    })

    if (result.error) setError('title', { message: 'Network error' })
  }

  const handleHourlyRateSubmit = async (taskData: Pick<TaskUpdateInput, 'hourlyRate'>) => {
    const result = await updateHourlyRate({
      id: task.id,
      data: {
        // projectId: task.project.id,
        // title: task.title,
        hourlyRate: taskData.hourlyRate,
      },
    })

    if (result.error) hourlyRateForm.setError('hourlyRate', { message: 'Network error' })
  }

  return (
    <>
      <TableCell className="mt-1 flex items-center">
        <>
          <InputField
            className="ml-2"
            variant="primary"
            {...register('title', { required: true })}
            onBlur={handleSubmit(handleTitleSubmit)}
            loading={fetchingTitle}
            errorMessage={errors.title?.message}
          />

          {openDeleteModal && <DeleteTaskModal open onClose={() => setOpenDeleteModal(false)} task={task} />}
        </>
      </TableCell>
      <TableCell>
        <InputField
          variant="primary"
          type="number"
          {...hourlyRateForm.register('hourlyRate', { required: true })}
          onBlur={hourlyRateForm.handleSubmit(handleHourlyRateSubmit)}
          loading={fetchingHourlyRate}
          errorMessage={hourlyRateForm.formState.errors.hourlyRate?.message}
        />
      </TableCell>
      <TableCell>
        {task.canModify && (
          <Button
            ariaLabel="Delete Task"
            variant="danger"
            tooltip="Delete Task"
            onClick={() => setOpenDeleteModal(true)}
          >
            <BiTrash />
          </Button>
        )}
      </TableCell>
    </>
  )
}
