import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'

import { InputField } from '@progwise/timebook-ui'
import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { getFormattedValue, parseNumericInput } from './invoiceFormatUtils'
import { InvoiceItemDeleteButton } from './invoiceItemDeleteButton'

const InvoiceItemListRowFragment = graphql(`
  fragment InvoiceItemListRow on InvoiceItem {
    id
    duration
    hourlyRate
    task {
      id
      title
      project {
        id
        title
      }
    }
    ...InvoiceItemDeleteButton
  }
`)

const InvoiceItemUpdateMutationDocument = graphql(`
  mutation invoiceItemUpdate($id: ID!, $data: InvoiceItemUpdateInput!) {
    invoiceItemUpdate(id: $id, data: $data) {
      id
    }
  }
`)

export interface InvoiceItemListRowProps {
  invoiceItem: FragmentType<typeof InvoiceItemListRowFragment>
  workFrom: string
  workUntil: string
}

export const InvoiceItemListRow = ({ invoiceItem: invoiceItemFragment }: InvoiceItemListRowProps) => {
  const invoiceItem = useFragment(InvoiceItemListRowFragment, invoiceItemFragment)
  const [{ fetching }, updateInvoiceItem] = useMutation(InvoiceItemUpdateMutationDocument)

  const {
    setError,
    register,
    formState: { isDirty, dirtyFields },
  } = useForm<Pick<InvoiceItemUpdateInput, 'hourlyRate' | 'duration'>>({
    resolver: zodResolver(invoiceItemInputValidations.pick({ duration: true, hourlyRate: true })),
  })
  const router = useRouter()

  const handleSubmitHelper = async (
    field: keyof Pick<InvoiceItemUpdateInput, 'duration' | 'hourlyRate'>,
    value: number,
    oldValue: number,
  ) => {
    const data = field === 'duration' ? { duration: value * 60 } : { hourlyRate: value }
    const organizationId = router.query.organizationId as string

    if (Number.isNaN(value)) {
      setError(field, { message: 'Invalid input' })
      return oldValue
    }

    try {
      const result = await updateInvoiceItem({
        id: invoiceItem.id,
        data: {
          ...data,
          organizationId,
        },
      })

      if (result.error) {
        throw new Error('Network error')
      }

      return value
    } catch (error) {
      setError(field, {
        message: error instanceof Error ? error.message : 'Network error',
      })
      return oldValue
    }
  }

  const handleInputEvent = async (
    event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    field: keyof Pick<InvoiceItemUpdateInput, 'duration' | 'hourlyRate'>,
    oldValue: number,
  ) => {
    const value = parseNumericInput((event.target as HTMLInputElement).value)
    const newValue = await handleSubmitHelper(field, value, oldValue)
    ;(event.target as HTMLInputElement).value = getFormattedValue(newValue)
  }

  return (
    <tr className="[&_td:first-child]:border-r-transparent [&_td]:border [&_td]:border-neutral [&_td]:p-2">
      <td className="print:hidden">
        <InvoiceItemDeleteButton invoiceItem={invoiceItem} />
      </td>
      <td className="text-left">
        <span className="font-bold">{invoiceItem.task.project.title}:</span> {invoiceItem.task.title}
      </td>
      <td>
        <InputField
          {...register('duration', { valueAsNumber: true })}
          className="input-sm input-ghost text-right print:border-none"
          defaultValue={getFormattedValue(invoiceItem.duration / 60)}
          onBlur={(event) => handleInputEvent(event, 'duration', invoiceItem.duration / 60)}
          onFocus={(event) => event.target.select()}
          loading={fetching}
          isDirty={isDirty && dirtyFields.duration}
          onKeyDown={async (event) => {
            if (event.code === 'Enter') {
              event.preventDefault()
              await handleInputEvent(event, 'duration', invoiceItem.duration / 60)
            }
          }}
        />
      </td>
      <td>
        <InputField
          {...register('hourlyRate', { valueAsNumber: true })}
          className="input-sm input-ghost text-right print:border-none"
          defaultValue={getFormattedValue(Number(invoiceItem.hourlyRate))}
          onBlur={(event) => handleInputEvent(event, 'hourlyRate', Number(invoiceItem.hourlyRate))}
          onFocus={(event) => event.target.select()}
          loading={fetching}
          isDirty={isDirty && dirtyFields.hourlyRate}
          onKeyDown={async (event) => {
            if (event.code === 'Enter') {
              event.preventDefault()
              await handleInputEvent(event, 'hourlyRate', Number(invoiceItem.hourlyRate))
            }
          }}
        />
      </td>
      <td className="text-right">{getFormattedValue((invoiceItem.duration / 60) * invoiceItem.hourlyRate)}</td>
    </tr>
  )
}
