import { MouseEventHandler } from 'react'
import { useForm } from 'react-hook-form'
import { TaskFragment, TaskInput } from '../../generated/graphql'

export interface TaskFormProps {
  task: TaskFragment
}

export const TaskForm = (props: TaskFormProps): JSX.Element => {
  const { task } = props
  const { handleSubmit, formState, register, reset } = useForm<TaskInput>({ defaultValues: task })

  const submitTask = (data: TaskInput) => {
    console.log(data)
  }

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (clickEvent) => {
    console.log(clickEvent)
    reset()
  }

  return (
    <form key={task.id} onSubmit={handleSubmit(submitTask)}>
      <label className="text-gray-500">
        <span>Name</span>
        <input type="text" disabled={formState.isSubmitting} {...register('title', { required: true })} />
        {formState.errors.title && <span>Required</span>}
      </label>
      <section>
        <button disabled={formState.isSubmitting} className="btn btn-gray1" onClick={handleCancel}>
          Cancel
        </button>
        <input type="submit" disabled={formState.isSubmitting} className="btn btn-gray1" title="Save" />
      </section>
    </form>
  )
}
