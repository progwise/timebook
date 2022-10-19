import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

import { CustomerFragment, useCustomerCreateMutation, useCustomersQuery } from '../../generated/graphql'
import { ComboBox } from '../combobox/combobox'

interface CustomerInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
}

export const CustomerInput = <TFieldValues extends FieldValues>({
  control,
  name,
}: CustomerInputProps<TFieldValues>) => {
  const router = useRouter()
  const slug = router.query.teamSlug?.toString() ?? ''
  const context = useMemo(() => ({ additionalTypenames: ['Customer'] }), [])
  const [{ data: customersData }] = useCustomersQuery({
    pause: !router.isReady,
    context,
    variables: { slug: slug },
  })
  const [{ fetching: createCustomerFetching }, createCustomer] = useCustomerCreateMutation()

  const {
    field: { onBlur, onChange, value },
    formState: { isSubmitting },
  } = useController({
    name,
    control,
  })

  const handleCreateCustomer = async (title: string): Promise<CustomerFragment> => {
    const result = await createCustomer({ data: { title }, teamSlug: slug })

    if (!result.data) {
      throw new Error('Customer creation failed')
    }

    const createdCustomer = result.data.customerCreate

    return createdCustomer
  }

  const selectedCustomer = customersData?.teamBySlug.customers.find((customer) => customer.id === value)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <ComboBox<CustomerFragment>
          value={selectedCustomer}
          disabled={isSubmitting}
          onChange={onChange}
          displayValue={(customer) => customer.title}
          onBlur={onBlur}
          options={customersData?.teamBySlug.customers ?? []}
          noOptionLabel="No Customer"
          onCreateNew={handleCreateCustomer}
          isCreating={createCustomerFetching}
        />
      </div>
    </div>
  )
}
