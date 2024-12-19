import { ErrorMessage } from '@hookform/error-message'
import { format, isValid, parse } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaCircleXmark } from 'react-icons/fa6'
import InputMask from 'react-input-mask'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { CalendarSelector } from '../../../../frontend/components/calendarSelector'
import { PageHeading } from '../../../../frontend/components/pageHeading'
import { ProtectedPage } from '../../../../frontend/components/protectedPage'
import { graphql } from '../../../../frontend/generated/gql'
import { InvoiceInput } from '../../../../frontend/generated/gql/graphql'

const getDate = (dateString: string | undefined | null): Date | undefined => {
  if (!dateString) {
    return undefined
  }
  const usedFormat = acceptedDateFormats.find((format) => isValid(parse(dateString, format, new Date())))
  if (!usedFormat) {
    return undefined
  }
  return parse(dateString, usedFormat, new Date().getDate())
}

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
  acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

const InvoiceCreateMutationDocument = graphql(`
  mutation invoiceCreate($data: InvoiceInput!) {
    invoiceCreate(data: $data) {
      id
    }
  }
`)

const NewInvoicePage = (): JSX.Element => {
  const [invoiceCreateResult, invoiceCreate] = useMutation(InvoiceCreateMutationDocument)
  const router = useRouter()
  const session = useSession()

  console.log(session.data?.user.id)

  const { organizationId } = router.query

  const { register, handleSubmit, formState, setValue, control } = useForm<InvoiceInput>({
    defaultValues: {
      organizationId: organizationId?.toString() ?? '',
      // createdByUserId: session.data?.user.id,
      // createdByUserId: 'cm4bd6ml20000mdhbrwjbdot0',
      // createdByUserId: session.data?.user.id ?? '',
    },
  })

  const { isSubmitting, errors, isDirty } = formState

  const handleCreateInvoice = async (data: InvoiceInput) => {
    try {
      const result = await invoiceCreate({ data })
      console.log(data)
      if (result.error) {
        throw new Error('graphql error')
      }
      const invoiceId = result.data?.invoiceCreate.id
      await router.push(`/organizations/${organizationId}/invoices/${invoiceId}`)
    } catch {}
  }

  const handleCancel = async () => {
    await router.push(`/organizations/${organizationId}`)
  }

  return (
    <ProtectedPage>
      <div className="flex flex-col gap-2">
        <form className="contents" id="invoice-form" onSubmit={handleSubmit(handleCreateInvoice)}>
          <PageHeading>Create a new invoice</PageHeading>
          <div>
            <InputField
              label="Name"
              type="text"
              disabled={isSubmitting}
              {...register('customerName')}
              placeholder="Enter a name"
              size={30}
              errorMessage={errors.customerName?.message}
              isDirty={isDirty}
            />
            <InputField
              label="Address"
              type="text"
              disabled={isSubmitting}
              {...register('customerAddress')}
              placeholder="Enter an address"
              size={30}
              errorMessage={errors.customerAddress?.message}
              isDirty={isDirty}
            />
          </div>
        </form>
        <div className="form-control">
          <div className="label">
            <label htmlFor="invoiceDate" className="label-text">
              Invoice date
            </label>
          </div>
          <Controller
            control={control}
            rules={{ validate: (value) => !value || isValidDateString(value) }}
            name="invoiceDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <div className="flex items-center">
                <InputMask
                  disabled={isSubmitting}
                  mask="9999-99-99"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value ?? ''}
                  id="invoiceDate"
                  type="text"
                  size={10}
                  className="input input-bordered py-1"
                />
                <CalendarSelector
                  disabled={isSubmitting}
                  className="shrink-0 pl-1"
                  date={getDate(value)}
                  hideLabel={true}
                  onDateChange={(newDate) => setValue('invoiceDate', format(newDate, 'yyyy-MM-dd'))}
                />
              </div>
            )}
          />
          <div className="label">
            <ErrorMessage
              name="invoiceDate"
              errors={errors}
              as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
            />
          </div>
        </div>

        <div className="flex justify-start gap-2">
          <button className="btn btn-secondary btn-sm" disabled={isSubmitting} onClick={handleCancel} type="button">
            Cancel
          </button>
          <button className="btn btn-primary btn-sm" type="submit" disabled={isSubmitting} form="invoice-form">
            Create
          </button>
        </div>

        {!!invoiceCreateResult.error && (
          <div role="alert" className="alert alert-error">
            <FaCircleXmark className="text-xl" />
            <span>Unable to create invoice</span>
          </div>
        )}
      </div>
    </ProtectedPage>
  )
}

export default NewInvoicePage
