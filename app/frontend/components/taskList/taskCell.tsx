import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { TaskFragment, useTaskUpdateMutation } from '../../generated/graphql'
import { InputField } from '../inputField/inputField'
import { CgSpinner } from 'react-icons/cg'
import { TaskFormData, taskInputSchema } from './taskList'

interface TaskCellProps {
  task: TaskFragment
}

export const TaskCell = ({ task }: TaskCellProps) => {
  const [{ fetching }, taskUpdate] = useTaskUpdateMutation()
  const {
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
    await taskUpdate({
      id: task.id,
      data: {
        projectId: task.project.id,
        title: taskData.title,
      },
    })
  }

  return (
    <div className="ml-2 flex min-w-[500px]">
      <InputField
        variant="primary"
        {...register('title', { required: true })}
        onBlur={handleSubmit(handleSubmitTask)}
      />

      {fetching && <CgSpinner className="inline h-8 w-8 animate-spin dark:text-blue-600" />}
      <ErrorMessage errors={errors} name="title" as={<span role="alert" className="text-red-700" />} />
    </div>
  )
}
