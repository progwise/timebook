import { useState } from 'react'
import { BiExit } from 'react-icons/bi'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

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
      <button className="btn btn-error btn-sm" onClick={() => setModalOpen(true)} title="Remove user from project">
        <BiExit />
      </button>
      <dialog className="modal" title="Remove User" open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="modal-box">
          <p>
            Do you really want to remove <b>{user.name}</b> from <b>{project.title}</b>?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-warning btn-sm">Cancel</button>
            </form>
            <button className="btn btn-error btn-sm" disabled={fetching} onClick={handleRemoveClick}>
              Remove
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
