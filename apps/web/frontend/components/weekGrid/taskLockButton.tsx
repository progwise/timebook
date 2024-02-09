import { FaLock, FaLockOpen } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const TaskLockButtonFragment = graphql(`
  fragment TaskLockButton on Task {
    id
    isLockedByUser
  }
`)

const LockTaskMutation = graphql(`
  mutation lockTask($taskId: ID!) {
    taskLock(taskId: $taskId) {
      id
      isLockedByUser
    }
  }
`)
const UnlockTaskMutation = graphql(`
  mutation unlockTask($taskId: ID!) {
    taskUnlock(taskId: $taskId) {
      id
      isLockedByUser
    }
  }
`)

interface TaskLockButtonProps {
  task: FragmentType<typeof TaskLockButtonFragment>
}

export const TaskLockButton = (props: TaskLockButtonProps) => {
  const task = useFragment(TaskLockButtonFragment, props.task)
  const [, lockTask] = useMutation(LockTaskMutation)
  const [, unlockTask] = useMutation(UnlockTaskMutation)

  const handleClick = async () => {
    const variables = { taskId: task.id }
    await (task.isLockedByUser ? unlockTask(variables) : lockTask(variables))
  }

  return (
    <button
      onClick={handleClick}
      className={`btn btn-square btn-error  btn-xs ${task.isLockedByUser ? '' : 'btn-outline'}`}
    >
      {task.isLockedByUser ? <FaLock /> : <FaLockOpen />}
    </button>
  )
}
