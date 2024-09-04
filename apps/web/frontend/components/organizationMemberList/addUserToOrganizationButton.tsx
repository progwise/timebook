import { useRef } from 'react'
import { FaArrowRightToBracket } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

const AddUserToOrganizationButtonUserFragment = graphql(`
  fragment AddUserToOrganizationButtonUser on User {
    id
    name
  }
`)

const AddUserToOrganizationButtonOrganizationFragment = graphql(`
  fragment AddUserToOrganizationButtonOrganization on Organization {
    id
    title
  }
`)

interface AddUserToOrganizationButtonProps {
  user: FragmentType<typeof AddUserToOrganizationButtonUserFragment>
  organization: FragmentType<typeof AddUserToOrganizationButtonOrganizationFragment>
}

const OrganizationMembershipCreateMutation = graphql(`
  mutation OrganizationMembershipCreate($organizationId: ID!, $userId: ID!) {
    organizationMembershipCreate(organizationId: $organizationId, userId: $userId) {
      id
    }
  }
`)

export const AddUserToOrganizationButton = (props: AddUserToOrganizationButtonProps) => {
  const [{ fetching }, createUser] = useMutation(OrganizationMembershipCreateMutation)
  const user = useFragment(AddUserToOrganizationButtonUserFragment, props.user)
  const organization = useFragment(AddUserToOrganizationButtonOrganizationFragment, props.organization)
  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleCreateClick = async () => {
    await createUser({
      organizationId: organization.id,
      userId: user.id,
    })
  }

  return (
    <>
      <button
        className="btn btn-success btn-sm"
        onClick={() => dialogReference.current?.showModal()}
        title="Add a user to the organization"
        type="button"
      >
        <FaArrowRightToBracket />
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add a new admin to organization</h3>
          <p className="py-4">
            Do you really want to add <b>{user.name}</b> to <b>{organization.title}</b>?
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-success btn-sm" disabled={fetching} onClick={handleCreateClick}>
              Add
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
