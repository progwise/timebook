import { useRef } from 'react'
import { FaArrowRightFromBracket } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const RemoveUserFromOrganizationButtonUserFragment = graphql(`
  fragment RemoveUserFromOrganizationButtonUser on User {
    id
    name
  }
`)

const RemoveUserFromOrganizationButtonOrganizationFragment = graphql(`
  fragment RemoveUserFromOrganizationButtonOrganization on Organization {
    id
    title
  }
`)

interface RemoveUserFromOrganizationButtonProps {
  user: FragmentType<typeof RemoveUserFromOrganizationButtonUserFragment>
  organization: FragmentType<typeof RemoveUserFromOrganizationButtonOrganizationFragment>
}

const OrganizationMembershipDeleteMutation = graphql(`
  mutation OrganizationMembershipDelete($organizationId: ID!, $userId: ID!) {
    organizationMembershipDelete(organizationId: $organizationId, userId: $userId) {
      id
    }
  }
`)

export const RemoveUserFromOrganizationButton = (props: RemoveUserFromOrganizationButtonProps) => {
  const [{ fetching }, removeUser] = useMutation(OrganizationMembershipDeleteMutation)
  const user = useFragment(RemoveUserFromOrganizationButtonUserFragment, props.user)
  const organization = useFragment(RemoveUserFromOrganizationButtonOrganizationFragment, props.organization)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleRemoveClick = async () => {
    await removeUser({
      organizationId: organization.id,
      userId: user.id,
    })
  }

  return (
    <>
      <button
        className="btn btn-error btn-sm"
        onClick={() => dialogReference.current?.showModal()}
        title="Remove user from the organization and all of the organization's projects"
        type="button"
      >
        <FaArrowRightFromBracket />
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Remove organization member</h3>
          <p className="py-4">
            Do you really want to remove <b>{user.name}</b> from <b>{organization.title}</b>?
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
