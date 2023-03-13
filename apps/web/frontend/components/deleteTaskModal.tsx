import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../generated/gql'
import { Modal } from './modal'

const DeleteTaskModalFragment = graphql(`
  fragment DeleteTaskModal on Task {
    id
    hasWorkHours
    title
  }
`)

const TaskDeleteMutationDocument = graphql(`
  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {
    taskDelete(id: $id) @skip(if: $hasWorkHours) {
      id
    }
    taskArchive(taskId: $id) @include(if: $hasWorkHours) {
      id
    }
  }
`)

export interface DeleteTaskModalProps {
  open: boolean
  onClose: () => void
  task: FragmentType<typeof DeleteTaskModalFragment>
}

export const DeleteTaskModal = ({ open, onClose, task: taskFragment }: DeleteTaskModalProps): JSX.Element => {
  const task = useFragment(DeleteTaskModalFragment, taskFragment)
  const [{ fetching }, taskDelete] = useMutation(TaskDeleteMutationDocument)

  const handleDeleteTask = async () => {
    try {
      await taskDelete({ id: task.id, hasWorkHours: task.hasWorkHours })
    } catch {}
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to delete ${task.title}?`}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose} disabled={fetching}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTask} disabled={fetching}>
            Delete
          </Button>
        </>
      }
    />
  )
}
