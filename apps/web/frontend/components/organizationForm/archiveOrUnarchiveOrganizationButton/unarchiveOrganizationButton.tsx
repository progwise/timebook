import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const UnarchiveOrganizationButtonFragment = graphql(`
  fragment UnarchiveOrganizationButton on Organization {
    id
    title
  }
`)

const OrganizationUnarchiveMutationDocument = graphql(`
  mutation organizationUnarchive($organizationId: ID!) {
    organizationUnarchive(organizationId: $organizationId) {
      id
      isArchived
    }
  }
`)

interface UnarchiveOrganizationButtonProps {
  organization: FragmentType<typeof UnarchiveOrganizationButtonFragment>
}

export const UnarchiveOrganizationButton = ({
  organization: organizationFragment,
}: UnarchiveOrganizationButtonProps): JSX.Element => {
  const organization = useFragment(UnarchiveOrganizationButtonFragment, organizationFragment)
  const [{ fetching }, organizationUnarchive] = useMutation(OrganizationUnarchiveMutationDocument)
  const router = useRouter()

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleUnarchiveOrganization = async () => {
    try {
      await organizationUnarchive({ organizationId: organization.id })
      await router.push('/organizations')
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button className="btn btn-outline btn-sm" type="button" onClick={() => dialogReference.current?.showModal()}>
        Unarchive
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Unarchive organization</h3>
          <p className="py-4">Are you sure you want to unarchive organization {organization.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleUnarchiveOrganization} disabled={fetching}>
              Unarchive
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
