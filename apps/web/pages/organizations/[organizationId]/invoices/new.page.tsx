/* eslint-disable unicorn/no-null */
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { FaCircleXmark } from 'react-icons/fa6'
import InputMask from 'react-input-mask'
import { useMutation } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { invoiceInputValidations } from '@progwise/timebook-validations'

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

const invoiceInputSchema: z.ZodSchema<InvoiceInput> = invoiceInputValidations
  .extend({
    invoiceWorkFrom: z
      .string()
      .nullish()
      .transform((value) => (value === '____-__-__' ? null : value))
      .refine((value) => !value || isValid(parseISO(value)), 'invalid date'),
    invoiceWorkUntil: z
      .string()
      .nullish()
      .transform((value) => (value === '____-__-__' ? null : value))
      .refine((value) => !value || isValid(parseISO(value)), 'invalid date'),
    invoiceDate: z.string(),
  })
  .superRefine((arguments_, context) => {
    if (!arguments_.invoiceWorkUntil) {
      return
    }
    const isStartBeforeEnd = (getDate(arguments_.invoiceWorkFrom) || 0) <= (getDate(arguments_.invoiceWorkUntil) || 1)

    if (!isStartBeforeEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end'],
        message: 'The end date must be after start date',
      })
    }
  })

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
  const invoiceDate = format(new Date(), 'yyyy-MM-dd')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors, isDirty },
  } = useForm<InvoiceInput>({
    defaultValues: {
      organizationId: organizationId?.toString() ?? '',
      invoiceDate,
    },
    resolver: zodResolver(invoiceInputSchema),
  })

  const handleCreateInvoice = async (data: InvoiceInput) => {
    try {
      const result = await invoiceCreate({ data })
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

  const handleSubmitHelper = (data: InvoiceInput) => {
    return handleCreateInvoice({
      ...data,
      invoiceWorkUntil: data.invoiceWorkUntil?.length ? data.invoiceWorkUntil : null,
      invoiceWorkFrom: data.invoiceWorkFrom?.length ? data.invoiceWorkFrom : null,
    })
  }

  return (
    <ProtectedPage>
      <div className="flex flex-col gap-2">
        <form className="contents" id="invoice-form" onSubmit={handleSubmit(handleSubmitHelper)}>
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
            <div className="form-control">
              <div className="label">
                <label htmlFor="start" className="label-text">
                  Start
                </label>
              </div>
              <Controller
                rules={{ validate: (value) => !value || isValidDateString(value) }}
                name="invoiceWorkFrom"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className="flex items-center">
                    <InputMask
                      disabled={isSubmitting}
                      mask="9999-99-99"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      id="invoiceWorkFrom"
                      type="text"
                      size={10}
                      className="input input-bordered py-1"
                    />
                    <CalendarSelector
                      disabled={isSubmitting}
                      className="shrink-0 pl-1"
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
            <div className="form-control">
              <div className="label">
                <label htmlFor="start" className="label-text">
                  End
                </label>
              </div>
              <Controller
                rules={{ validate: (value) => !value || isValidDateString(value) }}
                name="invoiceWorkUntil"
                render={({ field: { onChange, onBlur, value } }) => (
                  <div className="flex items-center">
                    <InputMask
                      mask="9999-99-99"
                      disabled={isSubmitting}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value ?? ''}
                      id="invoiceWorkUntil"
                      type="text"
                      size={10}
                      className="input input-bordered py-1"
                    />
                    <CalendarSelector
                      disabled={isSubmitting}
                      className="shrink-0 pl-1"
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
