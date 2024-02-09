import { FaLock, FaLockOpen } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../generated/gql'

const LockTaskButtonFragment = graphql(`
  fragment LockTaskButton on Task {
    id
    isLockedByAdmin
  }
`)

const TaskUpdateMutationDocument = graphql(`
  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {
    taskUpdate(id: $id, data: $data) {
      id
    }
  }
`)

interface LockTaskButtonProps {
  task: FragmentType<typeof LockTaskButtonFragment>
}

export const LockTaskButton = ({ task: taskFragment }: LockTaskButtonProps): JSX.Element => {
  const task = useFragment(LockTaskButtonFragment, taskFragment)
  const [{ fetching }, updateTask] = useMutation(TaskUpdateMutationDocument)

  const handleClick = async () => {
    await updateTask({
      id: task.id,
      data: {
        isLocked: !task.isLockedByAdmin,
      },
    })
  }

  return (
    <button
      className={`btn btn-sm ${task.isLockedByAdmin ? 'btn-warning' : 'btn-success'}`}
      onClick={handleClick}
      disabled={fetching}
    >
      {task.isLockedByAdmin ? <FaLock /> : <FaLockOpen />}
    </button>
  )
}
