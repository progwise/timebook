import { useRouter } from 'next/router'

import { AlertLink } from './alertLink'

export const SubscriptionStatusOrganizationLink = () => {
  const router = useRouter()
  const { status, id } = router.query
  const closeAlertHref = `/organizations/${id}`

  switch (status) {
    case 'subscriptionSuccess':
      return (
        <AlertLink closeHref={closeAlertHref} status="success">
          Your purchase has been confirmed! It may take a few minutes to update.
        </AlertLink>
      )
    case 'subscriptionError':
      return (
        <AlertLink closeHref={closeAlertHref} status="error">
          There was an error processing your payment. Please try again.
        </AlertLink>
      )
    case 'subscriptionCancel':
      return (
        <AlertLink closeHref={closeAlertHref} status="warning">
          Payment process was cancelled.
        </AlertLink>
      )
    default:
      // eslint-disable-next-line unicorn/no-null
      return null
  }
}
