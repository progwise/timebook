import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { FaCircleXmark } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'

import { PageHeading } from '../../../../frontend/components/pageHeading'
import { ProtectedPage } from '../../../../frontend/components/protectedPage'
import { graphql } from '../../../../frontend/generated/gql'
import { InvoiceInput } from '../../../../frontend/generated/gql/graphql'

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
  const invoiceDate = new Date().toString()

  const { register, handleSubmit, formState } = useForm<InvoiceInput>({
    defaultValues: {
      organizationId: organizationId?.toString() ?? '',
      invoiceDate,
    },
  })

  const { isSubmitting, errors, isDirty } = formState

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
