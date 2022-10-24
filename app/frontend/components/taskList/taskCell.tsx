import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
import { CgSpinner } from 'react-icons/cg'

import { TaskFragment, useTaskUpdateMutation } from '../../generated/graphql'
import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'
import { TaskFormData, taskInputSchema } from './taskList'

interface TaskCellProps {
  task: TaskFragment
  canModify?: boolean
  onDelete?: () => void
}

export const TaskCell = ({ task, onDelete, canModify }: TaskCellProps) => {
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
      {canModify && (
        <Button ariaLabel="Delete Task" variant="danger" tooltip="Delete Task" onClick={onDelete}>
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
    </>
  )
}
