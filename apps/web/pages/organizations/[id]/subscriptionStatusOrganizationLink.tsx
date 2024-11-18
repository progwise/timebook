import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaCircleCheck, FaCircleXmark, FaTriangleExclamation } from 'react-icons/fa6'

export const SubscriptionStatusOrganizationLink = () => {
  const router = useRouter()
  const { id, status } = router.query

  return (
    <>
      {status === 'subscriptionSuccess' && (
        <Link role="alert" className="alert alert-success mt-4 flex" href={`/organizations/${id}`} replace>
          <FaCircleCheck className="text-xl" />
          <span>Your purchase has been confirmed! It may take a few minutes to update.</span>
        </Link>
      )}
      {status === 'subscriptionError' && (
        <Link role="alert" className="alert alert-error mt-4 flex" href={`/organizations/${id}`}>
          <FaCircleXmark className="text-xl" />
          <span>There was an error processing your payment. Please try again.</span>
        </Link>
      )}
      {status === 'subscriptionCancel' && (
        <Link role="alert" className="alert alert-warning mt-4 flex" href={`/organizations/${id}`}>
          <FaTriangleExclamation className="text-xl" />
          <span>Payment process was cancelled.</span>
        </Link>
      )}
    </>
  )
}
