import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../frontend/components/button/button'
import { InputField } from '../../../frontend/components/inputField/inputField'
import { Modal } from '../../../frontend/components/modal'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import {
  CustomerInput,
  useCustomerDeleteMutation,
  useCustomerQuery,
  useCustomerUpdateMutation,
} from '../../../frontend/generated/graphql'
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

      await router.push(`/${teamSlug}/customers`)
    } catch {}
  }
  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Are you sure you want to delete project ${customerId}?`}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>
            {' '}
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

const ReportsPage = (): JSX.Element => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
  const router = useRouter()
  const { customerId, teamSlug } = router.query
  const [{ data, fetching }] = useCustomerQuery({ variables: { customerId: customerId?.toString() ?? '' } })
  const [, updateCustomer] = useCustomerUpdateMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({ defaultValues: { title: data?.customer.title } })

  if (fetching) {
    return <div>Loading...</div>
  }
  const handleSave = async (data: CustomerInput) => {
    await updateCustomer({ customerId: customerId?.toString() ?? '', data })
    await router.push(`/${teamSlug}/customers`)
  }

  return (
    <ProtectedPage>
      <div>
        <h1>Customers Details</h1>
        <form onSubmit={handleSubmit(handleSave)}>
          <label className="text-gray-500">
            <InputField variant="primary" placeholder="Name" {...register('title')} />
          </label>

          <div className="mt-16 flex justify-center gap-2">
            <Button type="button" variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
        {isDeleteModalOpen ? <DeleteCustomerModal onClose={() => setIsDeleteModalOpen(false)} /> : undefined}
      </div>
    </ProtectedPage>
  )
}
export default ReportsPage
