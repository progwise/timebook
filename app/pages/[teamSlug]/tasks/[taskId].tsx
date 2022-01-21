import { useRouter } from 'next/router'
import { TaskForm } from '../../../frontend/components/taskForm/taskForm'
import { useTaskQuery } from '../../../frontend/generated/graphql'

const Task = (): JSX.Element => {
  const router = useRouter()
  const { taskId } = router.query
  const [{ data }] = useTaskQuery({
    variables: { taskId: taskId?.toString() ?? '' },
    pause: !router.isReady,
  })
  const selectedTask = data?.task

  return (
    <article>
      <TaskForm task={selectedTask} />
    </article>
  )
}

export default Task
