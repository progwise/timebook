import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { Modal } from '../../modal'

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
    <Modal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to delete project ${project.title}?`}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose} disabled={projectDeleteState.fetching}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProject} disabled={projectDeleteState.fetching}>
            Delete
          </Button>
        </>
      }
    />
  )
}
