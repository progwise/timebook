import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
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

const customerInputSchema: yup.SchemaOf<CustomerInput> = yup.object({
  title: yup.string().trim().required().min(2).max(50),
})

export const CustomerForm = ({ customer }: CustomerFormProps) => {
  const [, updateCustomer] = useCustomerUpdateMutation()
  const [, createCustomer] = useCustomerCreateMutation()
  const router = useRouter()
  const { teamSlug } = router.query
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({ defaultValues: { title: customer?.title }, resolver: yupResolver(customerInputSchema) })
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
      <article>
        <form onSubmit={handleSubmit(handleSave)}>
          <InputField
            label="Customer Name"
            variant="primary"
            className=" dark:border-white dark:bg-slate-800 dark:text-white "
            placeholder="Name"
            {...register('title')}
          />

          <div>
            <ErrorMessage errors={errors} name="title" as={<span className="text-red-700" />} />
          </div>

          <div className="mt-16 flex justify-center gap-2 ">
            <div className="flex justify-start">
              {customer ? (
                <Button type="button" variant="tertiary" onClick={() => setIsDeleteModalOpen(true)}>
                  Delete
                  <BiTrash />
                </Button>
              ) : undefined}
            </div>
            <Button variant="secondary" onClick={handleCancelClick}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </div>
        </form>
      </article>
      {isDeleteModalOpen ? <DeleteCustomerModal onClose={() => setIsDeleteModalOpen(false)} /> : undefined}
    </>
  )
}
