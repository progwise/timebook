import { useRouter } from 'next/router'
import { FaCircleCheck, FaCircleXmark, FaTriangleExclamation } from 'react-icons/fa6'

import { StatusLink } from './statusLink'

export const SubscriptionStatusOrganizationLink = () => {
  const router = useRouter()
  const { status } = router.query

  switch (status) {
    case 'subscriptionSuccess':
      return (
        <StatusLink className="alert-success">
          <FaCircleCheck className="text-xl" />
          <span>Your purchase has been confirmed! It may take a few minutes to update.</span>
        </StatusLink>
      )
    case 'subscriptionError':
      return (
        <StatusLink className="alert-error">
          <FaCircleXmark className="text-xl" />
          <span>There was an error processing your payment. Please try again.</span>
        </StatusLink>
      )
    case 'subscriptionCancel':
      return (
        <StatusLink className="alert-warning">
          <FaTriangleExclamation className="text-xl" />
          <span>Payment process was cancelled.</span>
        </StatusLink>
      )
    default:
      // eslint-disable-next-line unicorn/no-null
      return null
  }
}
