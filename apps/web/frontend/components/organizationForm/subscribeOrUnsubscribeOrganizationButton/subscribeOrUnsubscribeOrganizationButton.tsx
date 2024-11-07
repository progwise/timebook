import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../../../generated/gql'
import { UnsubscribeOrganizationButton } from './unsubscribeOrganizationButton'

export const SubscribeOrUnsubscribeOrganizationButtonFragment = graphql(`
  fragment SubscribeOrUnsubscribeOrganizationButton on Organization {
    id
    subscriptionStatus
    ...UnsubscribeOrganizationButton
  }
`)

interface SubscribeOrUnsubscribeOrganizationButtonProps {
  organization: FragmentType<typeof SubscribeOrUnsubscribeOrganizationButtonFragment>
  disabled: boolean
}

export const SubscribeOrUnsubscribeOrganizationButton = (props: SubscribeOrUnsubscribeOrganizationButtonProps) => {
  const organization = useFragment(SubscribeOrUnsubscribeOrganizationButtonFragment, props.organization)

  if (organization.subscriptionStatus === 'ACTIVE') {
    return <UnsubscribeOrganizationButton organization={organization} disabled={props.disabled} />
  }

  return (
    <Link className="btn btn-primary btn-sm" href={`/organizations/${organization.id}/checkout`}>
      {organization.subscriptionStatus === 'CANCELLED' ? 'Renew' : 'Subscribe'}
    </Link>
  )
}
