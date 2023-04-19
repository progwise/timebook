import { useState } from 'react'
import { BiExit } from 'react-icons/bi'
import { useMutation } from 'urql'

import { Button } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Modal } from '../modal'

const RemoveUserFromProjectButtonUserFragment = graphql(`
  fragment RemoveUserFromProjectButtonUser on User {
    id
    name
  }
`)

const RemoveUserFromProjectButtonProjectFragment = graphql(`
  fragment RemoveUserFromProjectButtonProject on Project {
    id
    title
  }
`)

interface RemoveUserFromProjectButtonProps {
  user: FragmentType<typeof RemoveUserFromProjectButtonUserFragment>
  project: FragmentType<typeof RemoveUserFromProjectButtonProjectFragment>
}

const ProjectMembershipDeleteMutation = graphql(`
  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {
    projectMembershipDelete(projectId: $projectId, userId: $userId) {
      id
    }
  }
`)

export const RemoveUserFromProjectButton = (props: RemoveUserFromProjectButtonProps) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [{ fetching }, removeUser] = useMutation(ProjectMembershipDeleteMutation)
  const user = useFragment(RemoveUserFromProjectButtonUserFragment, props.user)
  const project = useFragment(RemoveUserFromProjectButtonProjectFragment, props.project)

  const handleRemoveClick = async () => {
    await removeUser({ projectId: project.id, userId: user.id })
    setModalOpen(false)
  }

  return (
    <>
      <Button variant="danger" onClick={() => setModalOpen(true)}>
        <BiExit />
      </Button>
      <Modal
        title="Remove User"
        actions={
          <>
            <Button variant="secondary" disabled={fetching} onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" disabled={fetching} onClick={handleRemoveClick}>
              Remove
            </Button>
          </>
        }
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        Do you really want to remove <b>{user.name}</b> from <b>{project.title}</b>?
      </Modal>
    </>
  )
}
