import { useRouter } from 'next/router'
import { ProjectFragment, useProjectDeleteMutation } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'

interface DeleteProjectModalProps {
  open: boolean
  onClose: () => void
  project: ProjectFragment
}

export const DeleteProjectModal = ({ onClose, project, open }: DeleteProjectModalProps): JSX.Element => {
  const [projectDeleteState, projectDelete] = useProjectDeleteMutation()
  const router = useRouter()

  const handleDeleteProject = async () => {
    try {
      await projectDelete({ id: project.id })
      await router.push(`/${router.query.teamSlug}/projects`)
    } catch {}
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to delete project ${project.title}?`}
      actions={
        <>
          <Button ariaLabel="Cancel" variant="secondary" onClick={onClose} disabled={projectDeleteState.fetching}>
            Cancel
          </Button>
          <Button
            ariaLabel="Delete"
            variant="danger"
            onClick={handleDeleteProject}
            disabled={projectDeleteState.fetching}
          >
            Delete
          </Button>
        </>
      }
    />
  )
}
