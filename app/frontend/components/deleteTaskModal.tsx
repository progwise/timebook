import { TaskFragment, useTaskDeleteMutation } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'

export interface DeleteTaskModalProps {
  open: boolean
  onClose: () => void
  task: TaskFragment
}

export const DeleteTaskModal = ({ open, onClose, task }: DeleteTaskModalProps): JSX.Element => {
  const [taskDeleteState, taskDelete] = useTaskDeleteMutation()

  const handleDeleteTask = async () => {
    try {
      await taskDelete({ id: task.id })
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
          <Button variant="secondary" onClick={onClose} disabled={taskDeleteState.fetching}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTask} disabled={taskDeleteState.fetching}>
            Delete
          </Button>
        </>
      }
    />
  )
}
