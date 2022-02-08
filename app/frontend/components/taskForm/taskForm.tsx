import { useForm } from 'react-hook-form'
import { InputField } from '../../../frontend/components/inputField/inputField'
import { TaskFragment, TaskInput } from '../../../frontend/generated/graphql'
import { Button } from '../button/button'

interface TaskFromProps {
  onSubmit: (data: TaskInput) => Promise<void>
  onCancel: () => void
  task: TaskFragment
}

export const TaskForm = (props: TaskFromProps): JSX.Element => {
  const { onSubmit, onCancel, task } = props
  const { register, handleSubmit } = useForm<TaskInput>({
    defaultValues: {
      title: task.title,
      projectId: task.project.id ?? '',
    },
  })

  const handleTaskSave = (data: TaskInput) => {
    return onSubmit({
      title: data.title,
      projectId: data.projectId,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleTaskSave)}>
      <label>
        <span className="whitespace-nowrap">Task Title</span>
        <InputField variant="primary" {...register('title', { required: true })} />
      </label>
      <label>
        <span className="whitespace-nowrap">Project ID</span>
        <InputField variant="primary" {...register('projectId', { required: true })} />
      </label>
      <div className="mt-16 flex justify-center gap-2">
        <Button ariaLabel="Cancel" variant="secondarySlim" onClick={onCancel} tooltip="Cancel the changes">
          Cancel
        </Button>
        <Button ariaLabel="Submit" type="submit" variant="primarySlim" tooltip="Save the changes">
          Save
        </Button>
      </div>
    </form>
  )
}
