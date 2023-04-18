import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
import { useMutation } from 'urql'

import { Button, InputField, TableCell, TableRow } from '@progwise/timebook-ui'
import { taskInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TaskUpdateInput } from '../../generated/gql/graphql'
import { DeleteTaskModal } from '../deleteTaskModal'

export const TaskRowFragment = graphql(`
  fragment TaskRow on Task {
    id
    title
    hourlyRate
    canModify
    ...DeleteTaskModal
  }
`)

const TaskUpdateMutationDocument = graphql(`
  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {
    taskUpdate(id: $id, data: $data) {
      id
    }
  }
`)

interface TaskRowProps {
  task: FragmentType<typeof TaskRowFragment>
}

export const TaskRow = ({ task: taskFragment }: TaskRowProps) => {
  const task = useFragment(TaskRowFragment, taskFragment)
  const [{ fetching: fetchingTitle }, updateTaskTitle] = useMutation(TaskUpdateMutationDocument)
  const [{ fetching: fetchingHourlyRate }, updateHourlyRate] = useMutation(TaskUpdateMutationDocument)
  const {
    setError,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields, isSubmitSuccessful },
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

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)

  const handleTitleSubmit = async (taskData: Pick<TaskUpdateInput, 'title'>) => {
    const result = await updateTaskTitle({
      id: task.id,
      data: {
        title: taskData.title,
      },
    })

    if (result.error) setError('title', { message: 'Network error' })
  }

  const handleHourlyRateSubmit = async (taskData: Pick<TaskUpdateInput, 'hourlyRate'>) => {
    const result = await updateHourlyRate({
      id: task.id,
      data: {
        hourlyRate: taskData.hourlyRate,
      },
    })

    if (result.error) hourlyRateForm.setError('hourlyRate', { message: 'Network error' })
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({}, { keepValues: true })
    }
  }, [isSubmitSuccessful, reset])

  return (
    <TableRow>
      <TableCell className="flex items-center">
        <InputField
          variant="primary"
          {...register('title', { required: true })}
          onBlur={handleSubmit(handleTitleSubmit)}
          loading={fetchingTitle}
          errorMessage={errors.title?.message}
          disabled={!task.canModify}
          isDirty={isDirty && dirtyFields.title}
        />
      </TableCell>
      <TableCell>
        <InputField
          variant="primary"
          type="number"
          {...hourlyRateForm.register('hourlyRate', { required: true })}
          onBlur={hourlyRateForm.handleSubmit(handleHourlyRateSubmit)}
          loading={fetchingHourlyRate}
          errorMessage={hourlyRateForm.formState.errors.hourlyRate?.message}
          label="hourly rate"
          hideLabel
          disabled={!task.canModify}
          isDirty={isDirty && hourlyRateForm.formState.dirtyFields.hourlyRate}
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
        {openDeleteModal && <DeleteTaskModal open onClose={() => setOpenDeleteModal(false)} task={task} />}
      </TableCell>
    </TableRow>
  )
}
