import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'

export const ArchiveOrganizationButtonFragment = graphql(`
  fragment ArchiveOrganizationButton on Organization {
    id
    title
  }
`)

const OrganizationArchiveMutationDocument = graphql(`
  mutation organizationArchive($organizationId: ID!) {
    organizationArchive(organizationId: $organizationId) {
      id
      isArchived
    }
  }
`)

interface ArchiveOrganizationButtonProps {
  organization: FragmentType<typeof ArchiveOrganizationButtonFragment>
  disabled: boolean
}

export const ArchiveOrganizationButton = ({
  organization: organizationFragment,
  disabled,
}: ArchiveOrganizationButtonProps): JSX.Element => {
  const organization = useFragment(ArchiveOrganizationButtonFragment, organizationFragment)
  const [{ fetching }, organizationArchive] = useMutation(OrganizationArchiveMutationDocument)
  const router = useRouter()

  const dialogReference = useRef<HTMLDialogElement>(null)

  const handleArchiveOrganization = async () => {
    try {
      await organizationArchive({ organizationId: organization.id })
      await router.push('/organizations')
    } catch {}
    dialogReference.current?.close()
  }

  return (
    <>
      <button
        className="btn btn-secondary btn-sm"
        type="button"
        onClick={() => dialogReference.current?.showModal()}
        disabled={disabled}
      >
        Archive
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Archive organization</h3>
          <p className="py-4">Are you sure you want to archive organization {organization.title}?</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Cancel
              </button>
            </form>
            <button className="btn btn-warning btn-sm" onClick={handleArchiveOrganization} disabled={fetching}>
              Archive
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
