import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { TaskFragment, TaskInput, useTaskUpdateMutation } from '../../generated/graphql'
import { InputField } from '../inputField/inputField'
import { taskInputSchema } from '../taskDetailsModal'
import { CgSpinner } from 'react-icons/cg'

interface TaskRowProps {
  task: TaskFragment
}

type TaskRowFormData = Pick<TaskInput, 'title'>

export const TaskRow = ({ task }: TaskRowProps) => {
  const [{ fetching }, taskUpdate] = useTaskUpdateMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskRowFormData>({
    mode: 'onChange',
    defaultValues: {
      title: task.title,
    },
    resolver: yupResolver(taskInputSchema),
  })

  const handleSubmitTask = async (taskData: TaskRowFormData) => {
    try {
      const result = await taskUpdate({
        id: task.id,
        data: {
          projectId: task.project.id,
          title: taskData.title,
        },
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  return (
    <div className="flex min-w-[500px]">
      <InputField
        variant="primary"
        className="font-small dark:placeholder-grey ml-2 rounded read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
        {...register('title', { required: true })}
        onBlur={handleSubmit(handleSubmitTask)}
      />

      {fetching && <CgSpinner className="ml-2 inline h-8 w-8 animate-spin dark:text-blue-600" />}
      <ErrorMessage errors={errors} name="title" as={<span aria-label="error field" className="ml-2 text-red-700" />} />
    </div>
  )
}
