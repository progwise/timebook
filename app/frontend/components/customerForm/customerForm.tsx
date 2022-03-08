import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { DeleteCustomerModal } from '../../../pages/[teamSlug]/customers/[customerId].page'
import {
  CustomerFragment,
  CustomerInput,
  useCustomerCreateMutation,
  useCustomerUpdateMutation,
} from '../../generated/graphql'
import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'

interface CustomerFormProps {
  customer?: CustomerFragment
}

export const CustomerForm = ({ customer }: CustomerFormProps) => {
  const [, updateCustomer] = useCustomerUpdateMutation()
  const [, createCustomer] = useCustomerCreateMutation()
  const router = useRouter()
  const { teamSlug } = router.query
  const { register, handleSubmit } = useForm<CustomerInput>({ defaultValues: { title: customer?.title } })
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)

  const handleCancelClick = async () => {
    router.push(`/${teamSlug}/team`)
  }

  const handleSave = async (data: CustomerInput) => {
    await (customer ? updateCustomer({ customerId: customer.id, data }) : createCustomer({ data }))

    await router.push(`/${teamSlug}/team`)
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleSave)}>
        <label className="text-gray-500">
          <InputField variant="primary" placeholder="Name" {...register('title')} />
        </label>

        <div className="mt-16 flex justify-center gap-2">
          <Button variant="secondary" onClick={handleCancelClick}>
            Cancel
          </Button>
          {customer ? (
            <Button type="button" variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete
            </Button>
          ) : undefined}
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
      {isDeleteModalOpen ? <DeleteCustomerModal onClose={() => setIsDeleteModalOpen(false)} /> : undefined}
    </>
  )
}
