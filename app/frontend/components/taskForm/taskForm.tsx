import { useForm } from 'react-hook-form'
import { InputField } from '../../../frontend/components/inputField/inputField'
import { TaskFragment, TaskInput } from '../../../frontend/generated/graphql'

interface TaskFromProps {
  task?: TaskFragment
}

export const TaskForm = (props: TaskFromProps): JSX.Element => {
  const { task } = props
  const { register } = useForm<TaskInput>({
    defaultValues: {
      title: task?.title,
      projectId: Number.parseInt(task?.project.id ?? ''),
    },
  })

  return (
    <form>
      <label>
        <span className="whitespace-nowrap">Task Title</span>
        <InputField variant="primary" {...register('title', { required: true })} />
      </label>
      <label>
        <span className="whitespace-nowrap">Project ID</span>
        <InputField variant="primary" {...register('projectId', { required: true })} />
      </label>
    </form>
  )
}
