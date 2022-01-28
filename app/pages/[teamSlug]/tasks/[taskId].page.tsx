import { useRouter } from 'next/router'
import { TaskForm } from '../../../frontend/components/taskForm/taskForm'
import { TaskInput, useTaskQuery, useTaskUpdateMutation } from '../../../frontend/generated/graphql'

const Task = (): JSX.Element => {
  const router = useRouter()
  const { taskId, teamSlug } = router.query
  const [{ data, fetching }] = useTaskQuery({
    variables: { taskId: taskId?.toString() ?? '' },
    pause: !router.isReady,
  })
  const [, taskUpdate] = useTaskUpdateMutation()

  if (fetching || !router.isReady) {
    return <div>Loading</div>
  }

  if (!data) {
    return <div>Failed to load task</div>
  }

  const { task } = data

  const handleSubmit = async (formData: TaskInput) => {
    try {
      const result = await taskUpdate({
        id: task.id,
        data: formData,
      })
      if (result.error) {
        throw new Error('graphql error')
      }
      await router.push(`/${teamSlug}/projects/${task.project.id}`)
    } catch {}
  }

  const handleCancel = async () => {
    await router.push(`/${teamSlug}/projects/${task.project.id}`)
  }
  return (
    <article>
      <TaskForm task={task} onSubmit={handleSubmit} onCancel={handleCancel} />
    </article>
  )
}

export default Task
