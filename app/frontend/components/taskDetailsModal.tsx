import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { InputField } from './inputField/inputField'
import { TaskFragment, TaskInput, useTaskUpdateMutation } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'

interface TaskDetailsModalProps {
  onClose: () => void
  task: TaskFragment
}

type TaskDetailsFormData = Pick<TaskInput, 'title'>

export const taskInputSchema: yup.SchemaOf<TaskDetailsFormData> = yup.object({
  title: yup.string().trim().required().min(4).max(50),
})

export const TaskDetailsModal = (props: TaskDetailsModalProps): JSX.Element => {
  const { onClose, task } = props
  const [{ fetching }, taskUpdate] = useTaskUpdateMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskDetailsFormData>({
    defaultValues: {
      title: task.title,
    },
    resolver: yupResolver(taskInputSchema),
  })

  const handleSubmitTask = async (taskData: TaskDetailsFormData) => {
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
      reset()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
    onClose()
  }

  return (
    <Modal
      title="Task Details"
      actions={
        <>
          <Button variant="secondary" onClick={onClose} tooltip="Cancel the changes" disabled={fetching}>
            Cancel
          </Button>
          <Button form="task-details" type="submit" variant="primary" tooltip="Submit the changes" disabled={fetching}>
            Save
          </Button>
        </>
      }
    >
      <form className="w-full" onSubmit={handleSubmit(handleSubmitTask)} id="task-details">
        <div className="mt-4 flex flex-col gap-5">
          <label>
            <span className="mr-2 whitespace-nowrap">Task Title</span>
            <InputField variant="primary" {...register('title', { required: true })} />
          </label>
          <ErrorMessage errors={errors} name="title" as={<span className="text-red-700" />} />
        </div>
      </form>
    </Modal>
  )
}
