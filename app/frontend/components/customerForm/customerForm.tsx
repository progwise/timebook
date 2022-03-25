import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({ defaultValues: { title: customer?.title } })
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
      <article className="timebook">
        <form onSubmit={handleSubmit(handleSave)}>
          <label className="text-gray-500">
            <InputField
              variant="primary"
              placeholder="Name"
              {...register('title', {
                required: 'Name required',
                minLength: { value: 3, message: 'At least 3 characters' },
              })}
            />
          </label>
          <div>
            <ErrorMessage errors={errors} name="title" as={<span className="text-red-700" />} />
          </div>

          <div className="mt-16 flex justify-center gap-2">
            <div className="flex justify-start">
              {customer ? (
                <Button type="button" variant="tertiary_gray_underlined" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete
                  <BiTrash />
                </Button>
              ) : undefined}
            </div>
            <Button variant="secondary_blue" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button type="submit" variant="primary_blue">
              Submit
            </Button>
          </div>
        </form>
      </article>
      {isDeleteModalOpen ? <DeleteCustomerModal onClose={() => setIsDeleteModalOpen(false)} /> : undefined}
    </>
  )
}
