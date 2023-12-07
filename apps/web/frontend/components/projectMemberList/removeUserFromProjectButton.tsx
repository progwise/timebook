import { useRef } from 'react'
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
  const [{ fetching }, removeUser] = useMutation(ProjectMembershipDeleteMutation)
  const user = useFragment(RemoveUserFromProjectButtonUserFragment, props.user)
  const project = useFragment(RemoveUserFromProjectButtonProjectFragment, props.project)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleRemoveClick = async () => {
    await removeUser({ projectId: project.id, userId: user.id })
  }

  return (
    <>
      <button
        className="btn btn-error btn-sm"
        onClick={() => dialogReference.current?.showModal()}
        title="Remove user from project"
        type="button"
      >
        <BiExit />
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Remove member</h3>
          <p className="py-4">
            Do you really want to remove <b>{user.name}</b> from <b>{project.title}</b>?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
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
