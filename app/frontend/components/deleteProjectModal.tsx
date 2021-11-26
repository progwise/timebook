import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import { ProjectFragment, useProjectDeleteMutation } from '../generated/graphql'
import { Button } from './button/button'

interface ModalProps {
  open: boolean
  onClose: () => void
  project: ProjectFragment
}

export const DeleteProjectModal = ({ onClose, project, open }: ModalProps): JSX.Element => {
  const [projectDeleteState, projectDelete] = useProjectDeleteMutation()
  const router = useRouter()

  const handleDeleteProject = async () => {
    try {
      await projectDelete({ id: project.id })
      await router.push('/projects')
    } catch {}
  }

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-3xl p-7 shadow-lg">
          <Dialog.Title className="text-center text-lg">
            Are you sure you want to delete project {project?.title}?
          </Dialog.Title>
          <div className="flex gap-4 pt-5 flex-wrap flex-col sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose} disabled={projectDeleteState.fetching}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDeleteProject} disabled={projectDeleteState.fetching}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
