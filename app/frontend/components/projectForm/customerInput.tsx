import { Combobox, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { Fragment, useMemo, useState } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { HiCheck, HiSelector } from 'react-icons/hi'
import { CustomerFragment, useCustomerCreateMutation, useCustomersQuery } from '../../generated/graphql'

interface CustomerInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
}

export const CustomerInput = <TFieldValues extends FieldValues>({
  control,
  name,
}: CustomerInputProps<TFieldValues>) => {
  const router = useRouter()
  const context = useMemo(() => ({ additionalTypenames: ['Customer'] }), [])
  const [{ data: customersData }] = useCustomersQuery({
    pause: !router.isReady,
    context,
  })
  const [{ fetching: createCustomerFetching }, createCustomer] = useCustomerCreateMutation()
  const [customersQuery, setCustomersQuery] = useState('')

  const filteredCustomers =
    customersData?.team.customers.filter((customer) => {
      return customer.title.toLowerCase().includes(customersQuery.toLowerCase())
    }) ?? []

  const {
    field: { onBlur, onChange, value },
    formState: { isSubmitting },
  } = useController({
    name,
    control,
  })

  const handleChange = async (selectedCustomer?: CustomerFragment) => {
    if (selectedCustomer && !selectedCustomer.id) {
      const result = await createCustomer({ data: { title: selectedCustomer.title } })

      if (!result.data) {
        throw new Error('Customer creation failed')
      }
      const createdCustomer = result.data.customerCreate

      selectedCustomer.id = createdCustomer.id
    }
    // eslint-disable-next-line unicorn/no-null
    onChange(selectedCustomer?.id ?? null)
  }

  const selectedCustomer = customersData?.team.customers.find((customer) => customer.id === value)

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div>
          <Combobox value={selectedCustomer} disabled={createCustomerFetching || isSubmitting} onChange={handleChange}>
            <div className="relative mt-1">
              <div className="relative w-full cursor-default overflow-hidden rounded bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input<'input', CustomerFragment | undefined>
                  className="w-full py-2  pl-3 text-sm leading-5 focus:ring-0 dark:border-white dark:bg-slate-800 dark:text-white"
                  displayValue={(customer) => customer?.title ?? 'No Customer'}
                  onChange={(event) => setCustomersQuery(event.target.value)}
                  onBlur={onBlur}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Combobox.Option
                    value={undefined}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                      }`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          No Customer
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-indigo-600'
                            }`}
                          >
                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : undefined}
                      </>
                    )}
                  </Combobox.Option>
                  {customersQuery.length > 0 && (
                    <Combobox.Option
                      value={{ id: undefined, title: customersQuery }}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            Create &quot;{customersQuery}&quot;
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-indigo-600'
                              }`}
                            >
                              <HiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : undefined}
                        </>
                      )}
                    </Combobox.Option>
                  )}
                  {filteredCustomers.map((customer) => (
                    <Combobox.Option
                      key={customer.id}
                      value={customer}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {customer.title}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-indigo-600'
                              }`}
                            >
                              <HiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : undefined}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </div>
      </div>
    </div>
  )
}
