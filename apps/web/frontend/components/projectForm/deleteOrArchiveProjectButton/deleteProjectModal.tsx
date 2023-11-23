import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const DeleteProjectModalFragment = graphql(`
  fragment DeleteProjectModal on Project {
    id
    title
  }
`)

const ProjectDeleteMutationDocument = graphql(`
  mutation projectDelete($id: ID!) {
    projectDelete(id: $id) {
      id
    }
  }
`)

interface DeleteProjectModalProps {
  open: boolean
  onClose: () => void
  project: FragmentType<typeof DeleteProjectModalFragment>
}

export const DeleteProjectModal = ({
  onClose,
  project: projectFragment,
  open,
}: DeleteProjectModalProps): JSX.Element => {
  const project = useFragment(DeleteProjectModalFragment, projectFragment)
  const [projectDeleteState, projectDelete] = useMutation(ProjectDeleteMutationDocument)
  const router = useRouter()

  const handleDeleteProject = async () => {
    try {
      await projectDelete({ id: project.id })
      await router.push('/projects')
    } catch {}
  }

  return (
    <dialog className="modal" open={open} onClose={onClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Delete project</h3>
        <p className="py-4">Are you sure you want to delete {project.title}?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-warning btn-sm" onClick={onClose} disabled={projectDeleteState.fetching}>
              Cancel
            </button>
          </form>
          <button className="btn btn-error btn-sm" onClick={handleDeleteProject} disabled={projectDeleteState.fetching}>
            Delete
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
