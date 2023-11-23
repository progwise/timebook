import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const ArchiveProjectModalFragment = graphql(`
  fragment ArchiveProjectModal on Project {
    id
    title
  }
`)

const ProjectArchiveMutationDocument = graphql(`
  mutation projectArchive($projectId: ID!) {
    projectArchive(projectId: $projectId) {
      id
      isArchived
    }
  }
`)

interface ArchiveProjectModalProps {
  open: boolean
  onClose: () => void
  project: FragmentType<typeof ArchiveProjectModalFragment>
}

export const ArchiveProjectModal = ({
  onClose,
  project: projectFragment,
  open,
}: ArchiveProjectModalProps): JSX.Element => {
  const project = useFragment(ArchiveProjectModalFragment, projectFragment)
  const [projectArchiveState, projectArchive] = useMutation(ProjectArchiveMutationDocument)
  const router = useRouter()

  const handleArchiveProject = async () => {
    try {
      await projectArchive({ projectId: project.id })
      await router.push('/projects')
    } catch {}
  }

  return (
    <dialog className="modal" open={open} onClose={onClose}>
      <div className="modal-box">
        <h3 className="text-lg font-bold">Archive project</h3>
        <p className="py-4">Are you sure you want to archive project {project.title}?</p>
        <div className="modal-action">
          <button
            className="btn btn-success btn-sm"
            onClick={handleArchiveProject}
            disabled={projectArchiveState.fetching}
          >
            Archive
          </button>
          <form method="dialog">
            <button
              className="btn btn-warning btn-sm"
              onClick={onClose}
              disabled={projectArchiveState.fetching}
              type="button"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
