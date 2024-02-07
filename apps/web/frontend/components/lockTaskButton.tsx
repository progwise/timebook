import { BiLock, BiLockOpen } from 'react-icons/bi'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../generated/gql'

const LockTaskButtonFragment = graphql(`
  fragment LockTaskButton on Task {
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

interface LockTaskButtonProps {
  task: FragmentType<typeof LockTaskButtonFragment>
}

export const LockTaskButton = ({ task: taskFragment }: LockTaskButtonProps): JSX.Element => {
  const task = useFragment(LockTaskButtonFragment, taskFragment)
  const [{ fetching }, lockTask] = useMutation(LockTaskMutation)
  const [, unlockTask] = useMutation(UnlockTaskMutation)

  const handleClick = async () => {
    const variables = { taskId: task.id }
    try {
      await (task.isLockedByUser ? unlockTask(variables) : lockTask(variables))
    } catch {}
  }

  return (
    <button
      className={`btn btn-sm btn-block ${task.isLockedByUser ? 'btn-warning' : 'btn-success'}`}
      onClick={handleClick}
      disabled={fetching}
    >
      {task.isLockedByUser ? <BiLock /> : <BiLockOpen />}
    </button>
  )
}
