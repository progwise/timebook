import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const UnarchiveProjectModalFragment = graphql(`
  fragment UnarchiveProjectModal on Project {
    id
    title
  }
`)

const ProjectUnarchiveMutationDocument = graphql(`
  mutation projectUnarchive($projectId: ID!) {
    projectUnarchive(projectId: $projectId) {
      id
      isArchived
    }
  }
`)

interface UnarchiveProjectModalProps {
  open: boolean
  onClose: () => void
  project: FragmentType<typeof UnarchiveProjectModalFragment>
}

export const UnarchiveProjectModal = ({
  onClose,
  project: projectFragment,
  open,
}: UnarchiveProjectModalProps): JSX.Element => {
  const project = useFragment(UnarchiveProjectModalFragment, projectFragment)
  const [projectUnarchiveState, projectUnarchive] = useMutation(ProjectUnarchiveMutationDocument)
  const router = useRouter()

  const handleUnarchiveProject = async () => {
    try {
      await projectUnarchive({ projectId: project.id })
      await router.push('/projects')
    } catch {}
  }

  return (
    <dialog className="modal" open={open} onClose={onClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Unarchive project</h3>
        <p className="py-4">Are you sure you want to unarchive project {project.title}?</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-warning btn-sm" onClick={onClose} disabled={projectUnarchiveState.fetching}>
              Cancel
            </button>
          </form>
          <button
            className="btn btn-error btn-sm"
            onClick={handleUnarchiveProject}
            disabled={projectUnarchiveState.fetching}
          >
            Unarchive
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
