import { SubscriptionStatus } from '../../generated/gql/graphql'

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
