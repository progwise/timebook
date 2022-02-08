import { TaskFragment, useTaskDeleteMutation } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'

export interface DeleteTaskModalProps {
  open: boolean
  onClose: () => void
  task: TaskFragment
}

export const DeleteTaskModal = ({ open, onClose, task }: DeleteTaskModalProps): JSX.Element => {
  const [{ fetching }, taskDelete] = useTaskDeleteMutation()

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
          <Button ariaLabel="Cancel" variant="secondary" onClick={onClose} disabled={fetching}>
            Cancel
          </Button>
          <Button ariaLabel="Delete" variant="danger" onClick={handleDeleteTask} disabled={fetching}>
            Delete
          </Button>
        </>
      }
    />
  )
}
