import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const UnsubscribeOrganizationButtonFragment = graphql(`
  fragment UnsubscribeOrganizationButton on Organization {
    id
    title
  }
`)

const OrganizationUnsubscribeMutationDocument = graphql(`
  mutation organizationUnsubscribe($organizationId: ID!) {
    organizationPaypalSubscriptionCancel(organizationId: $organizationId) {
      id
    }
  }
`)

interface UnsubscribeOrganizationButtonProps {
  organization: FragmentType<typeof UnsubscribeOrganizationButtonFragment>
  disabled: boolean
}

export const UnsubscribeOrganizationButton = ({
  organization: organizationFragment,
  disabled,
}: UnsubscribeOrganizationButtonProps): JSX.Element => {
  const organization = useFragment(UnsubscribeOrganizationButtonFragment, organizationFragment)
  const [{ fetching }, organizationUnsubscribe] = useMutation(OrganizationUnsubscribeMutationDocument)

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleUnsubscribeOrganization = async () => {
    try {
      await organizationUnsubscribe({ organizationId: organization.id })
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button
        className="btn btn-outline btn-error btn-sm"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={disabled}
      >
        Unsubscribe
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Unsubscribe from Organization</h3>
          <p className="py-4">Are you sure you want to unsubscribe from {organization.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleUnsubscribeOrganization} disabled={fetching}>
              Unsubscribe
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
