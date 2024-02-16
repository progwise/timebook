import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'
import { taskInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { TaskUpdateInput } from '../../generated/gql/graphql'
import { DeleteTaskButton } from '../deleteTaskButton'
import { LockTaskButton } from '../lockTaskButton'

export const TaskRowFragment = graphql(`
  fragment TaskRow on Task {
    id
    title
    canModify
    isLockedByAdmin
    ...DeleteTaskButton
    ...LockTaskButton
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

  const handleTitleSubmit = async (taskData: Pick<TaskUpdateInput, 'title'>) => {
    const result = await updateTaskTitle({
      id: task.id,
      data: {
        title: taskData.title,
      },
    })

    if (result.error) setError('title', { message: 'Network error' })
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({}, { keepValues: true })
    }
  }, [isSubmitSuccessful, reset])

  return (
    <tr>
      <td className="flex w-full items-center p-1">
        <InputField
          {...register('title', { required: true })}
          onBlur={handleSubmit(handleTitleSubmit)}
          loading={fetchingTitle}
          errorMessage={errors.title?.message}
          disabled={!task.canModify}
          isDirty={isDirty && dirtyFields.title}
        />
      </td>
      {task.canModify && (
        <>
          <td className="w-px">
            <LockTaskButton task={task} />
          </td>
          <td className="w-px">
            <DeleteTaskButton task={task} />
          </td>
        </>
      )}
    </tr>
  )
}
