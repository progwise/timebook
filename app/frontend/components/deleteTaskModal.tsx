import { TaskFragment, useTaskDeleteMutation, useTaskArchiveMutation } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'

export interface DeleteTaskModalProps {
  open: boolean
  onClose: () => void
  task: TaskFragment
}

export const DeleteTaskModal = ({ open, onClose, task }: DeleteTaskModalProps): JSX.Element => {
  const [taskDeleteState, taskDelete] = useTaskDeleteMutation()
  const [taskArchiveState, taskArchive] = useTaskArchiveMutation()
  const fetching = taskDeleteState.fetching || taskArchiveState.fetching

  const handleDeleteTask = async () => {
    try {
      await (task.hasWorkHours ? taskArchive({ taskId: task.id }) : taskDelete({ id: task.id }))
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
          <Button variant="secondary" onClick={onClose} disabled={fetching}>
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
