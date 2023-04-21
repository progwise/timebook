import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { Modal } from '../../modal'

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
    <Modal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to unarchive project ${project.title}?`}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose} disabled={projectUnarchiveState.fetching}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleUnarchiveProject} disabled={projectUnarchiveState.fetching}>
            Unarchive
          </Button>
        </>
      }
    />
  )
}
