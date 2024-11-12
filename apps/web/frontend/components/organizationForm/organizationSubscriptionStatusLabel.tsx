import { graphql } from '../../generated/gql'
import { SubscriptionStatus } from '../../generated/gql/graphql'

export const OrganizationSubscriptionStatusLabelFragment = graphql(`
  fragment OrganizationSubscriptionStatusLabel on Organization {
    subscriptionStatus
  }
`)

interface OrganizationSubscriptionStatusLabelProps {
  subscriptionStatus?: SubscriptionStatus
}

export const OrganizationSubscriptionStatusLabel = ({
  subscriptionStatus,
}: OrganizationSubscriptionStatusLabelProps) => {
  if (subscriptionStatus === 'ACTIVE') {
    return <span className="badge badge-success">Active</span>
  }
  if (subscriptionStatus === 'CANCELLED') {
    return <span className="badge badge-warning">Cancelled</span>
  }
  return <span className="badge badge-neutral">Free</span>
}
