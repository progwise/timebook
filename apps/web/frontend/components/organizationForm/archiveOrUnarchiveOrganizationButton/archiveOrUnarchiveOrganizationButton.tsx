import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { ArchiveOrganizationButton } from './archiveOrganizationButton'
import { UnarchiveOrganizationButton } from './unarchiveOrganizationButton'

export const ArchiveOrUnarchiveOrganizationButtonFragment = graphql(`
  fragment ArchiveOrUnarchiveOrganizationButton on Organization {
    id
    isArchived
    ...UnarchiveOrganizationButton
    ...ArchiveOrganizationButton
  }
`)

interface ArchiveOrUnarchiveOrganizationButtonProps {
  organization: FragmentType<typeof ArchiveOrUnarchiveOrganizationButtonFragment>
  disabled: boolean
}

export const ArchiveOrUnarchiveOrganizationButton = (props: ArchiveOrUnarchiveOrganizationButtonProps) => {
  const organization = useFragment(ArchiveOrUnarchiveOrganizationButtonFragment, props.organization)

  if (organization.isArchived) {
    return <UnarchiveOrganizationButton organization={organization} disabled={props.disabled} />
  }

  return <ArchiveOrganizationButton organization={organization} disabled={props.disabled} />
}
