import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
  const { setError, register, handleSubmit, formState } = useForm<TaskUpdateInput>({
    mode: 'onChange',
    defaultValues: {
      title: task.title,
      hourlyRate: task.hourlyRate,
    },
    resolver: zodResolver(taskInputValidations.pick({ title: true, hourlyRate: true })),
  })

  const { errors, isDirty, dirtyFields } = formState

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

    if (result.error) setError('hourlyRate', { message: 'Network error' })
  }

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
          {...register('hourlyRate', { required: true })}
          onBlur={handleSubmit(handleHourlyRateSubmit)}
          loading={fetchingHourlyRate}
          errorMessage={errors.hourlyRate?.message}
          label="hourly rate"
          hideLabel
          disabled={!task.canModify}
          isDirty={isDirty && dirtyFields.hourlyRate}
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
