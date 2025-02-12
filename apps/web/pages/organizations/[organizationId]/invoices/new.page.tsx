import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaCircleXmark } from 'react-icons/fa6'
import InputMask from 'react-input-mask'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { CalendarSelector } from '../../../../frontend/components/calendarSelector'
import { dateStringValidation, getDate } from '../../../../frontend/components/dateStringValidation'
import { PageHeading } from '../../../../frontend/components/pageHeading'
import { ProtectedPage } from '../../../../frontend/components/protectedPage'
import { graphql } from '../../../../frontend/generated/gql'
import { InvoiceInput } from '../../../../frontend/generated/gql/graphql'
import { invoiceInputSchema } from './invoiceInputSchema'

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

  const { organizationId } = router.query

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
    setValue,
    control,
  } = useForm<InvoiceInput>({
    defaultValues: {
      organizationId: organizationId?.toString() ?? '',
    },
    resolver: zodResolver(invoiceInputSchema),
  })

  const handleCreateInvoice = async (data: InvoiceInput) => {
    data.organizationId = organizationId?.toString() ?? ''
    try {
      const result = await invoiceCreate({ data })
      if (result.error) {
        throw new Error('graphql error')
      }
      const invoiceId = result.data?.invoiceCreate.id
      await router.push(`/organizations/${organizationId}/invoices/${invoiceId}`)
    } catch {}
  }

  const handleCancel = () => {
    router.push(`/organizations/${organizationId}`)
  }

  return (
    <ProtectedPage>
      <div className="flex flex-wrap items-start gap-2">
        <form className="contents" id="invoice-form" onSubmit={handleSubmit(handleCreateInvoice)}>
          <PageHeading>Create a new invoice</PageHeading>
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
          <div>
            <div className="form-control">
              <div className="label">
                <label htmlFor="start" className="label-text">
                  Start
                </label>
              </div>
              <Controller
                control={control}
                rules={{ validate: (value) => !value || dateStringValidation(value) }}
                name="invoiceWorkFrom"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className="flex gap-1">
                    <InputMask
                      disabled={isSubmitting}
                      mask="9999-99-99"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      id="invoiceWorkFrom"
                      type="text"
                      size={10}
                      className="input input-bordered"
                    />
                    <CalendarSelector
                      disabled={isSubmitting}
                      className="btn-md"
                      date={getDate(value)}
                      hideLabel={true}
                      onDateChange={(newDate) => setValue('invoiceWorkFrom', format(newDate, 'yyyy-MM-dd'))}
                    />
                  </div>
                )}
              />
              <div className="label">
                <ErrorMessage
                  name="invoiceWorkFrom"
                  errors={errors}
                  as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="form-control">
              <div className="label">
                <label htmlFor="start" className="label-text">
                  End
                </label>
              </div>
              <Controller
                control={control}
                rules={{ validate: (value) => !value || dateStringValidation(value) }}
                name="invoiceWorkUntil"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className="flex gap-1">
                    <InputMask
                      mask="9999-99-99"
                      disabled={isSubmitting}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      id="invoiceWorkUntil"
                      type="text"
                      size={10}
                      className="input input-bordered"
                    />
                    <CalendarSelector
                      disabled={isSubmitting}
                      className="btn-md"
                      date={getDate(value)}
                      hideLabel={true}
                      onDateChange={(newDate) => setValue('invoiceWorkUntil', format(newDate, 'yyyy-MM-dd'))}
                    />
                  </div>
                )}
              />
              <div className="label">
                <ErrorMessage
                  name="invoiceWorkUntil"
                  errors={errors}
                  as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
                />
              </div>
            </div>
          </div>
        </form>
        <div className="flex w-full gap-2">
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
