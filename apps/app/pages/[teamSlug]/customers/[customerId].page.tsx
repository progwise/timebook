import { useRouter } from 'next/router'

import { Button } from '@progwise/timebook-ui'
import { CustomerForm } from '../../../frontend/components/customerForm/customerForm'

import { Modal } from '../../../frontend/components/modal'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useCustomerDeleteMutation, useCustomerQuery } from '../../../frontend/generated/graphql'

interface DeleteCustomerModalProps {
  onClose: () => void
}
export const DeleteCustomerModal = ({ onClose }: DeleteCustomerModalProps) => {
  const [, customerDelete] = useCustomerDeleteMutation()
  const router = useRouter()
  const { customerId, teamSlug } = router.query
  const handleDeleteCustomer = async () => {
    try {
      await customerDelete({ customerId: customerId as string })

      await router.push(`/${teamSlug}/team`)
    } catch {}
  }
  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Are you sure you want to delete customer: ${customerId}?`}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCustomer}>
            Delete
          </Button>
        </>
      }
    />
  )
}

const CustomerDetailsPage = (): JSX.Element => {
  const router = useRouter()
  const { customerId } = router.query
  const [{ data, fetching, error }] = useCustomerQuery({ variables: { customerId: customerId?.toString() ?? '' } })

  if (fetching) {
    return <div>Loading...</div>
  }
  if (error) {
    return <h1>customer not found</h1>
  }

  return (
    <ProtectedPage>
      <div>
        <CustomerForm customer={data?.customer} />
      </div>
    </ProtectedPage>
  )
}
export default CustomerDetailsPage
