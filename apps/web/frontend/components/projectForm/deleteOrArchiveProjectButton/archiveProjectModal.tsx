import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { Modal } from '../../modal'

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
    <Modal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to archive project ${project.title}?`}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose} disabled={projectArchiveState.fetching}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleArchiveProject} disabled={projectArchiveState.fetching}>
            Archive
          </Button>
        </>
      }
    />
  )
}
