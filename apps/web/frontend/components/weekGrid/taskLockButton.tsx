import { BiLock, BiLockOpen } from 'react-icons/bi'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

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
    <Button variant={task.isLockedByUser ? 'danger' : 'secondary'} onClick={handleClick} className="p-1 text-lg">
      {task.isLockedByUser ? <BiLock /> : <BiLockOpen />}
    </Button>
  )
}
