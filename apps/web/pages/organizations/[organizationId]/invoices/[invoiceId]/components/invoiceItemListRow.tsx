import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'urql'

import { InputField } from '@progwise/timebook-ui'
import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemUpdateInput } from '../../../../../../frontend/generated/gql/graphql'
import { getFormattedValue, parseNumericInput } from './invoiceFormatUtils'

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
  }
`)

const InvoiceItemUpdateMutationDocument = graphql(`
  mutation invoiceItemUpdate($id: ID!, $data: InvoiceItemUpdateInput!) {
    invoiceItemUpdate(id: $id, data: $data) {
      id
    }
  }
`)

const TaskWorkHoursQuery = graphql(`
  query TaskWorkHours($id: ID!, $from: Date!, $to: Date!) {
    task(taskId: $id) {
      id
      workHours(from: $from, to: $to) {
        id
        duration
        date
      }
    }
  }
`)

export interface InvoiceItemListRowProps {
  invoiceItem: FragmentType<typeof InvoiceItemListRowFragment>
  workFrom: string
  workUntil: string
}

export const InvoiceItemListRow = ({
  invoiceItem: invoiceItemFragment,
  workFrom,
  workUntil,
}: InvoiceItemListRowProps) => {
  const invoiceItem = useFragment(InvoiceItemListRowFragment, invoiceItemFragment)
  const [{ fetching }, updateInvoiceItem] = useMutation(InvoiceItemUpdateMutationDocument)

  const {
    setError,
    register,
    handleSubmit,
    formState: { isDirty, dirtyFields },
  } = useForm<Pick<InvoiceItemUpdateInput, 'hourlyRate' | 'duration'>>({
    resolver: zodResolver(invoiceItemInputValidations.pick({ duration: true, hourlyRate: true })),
  })

  const [taskWorkHoursResult] = useQuery({
    query: TaskWorkHoursQuery,
    variables: {
      id: invoiceItem.task.id,
      from: workFrom,
      to: workUntil,
    },
  })

  const handleSubmitDurationHelper = async (invoiceItemData: Pick<InvoiceItemUpdateInput, 'duration'>) => {
    const duration = invoiceItemData.duration ?? invoiceItem.duration

    const result = await updateInvoiceItem({
      id: invoiceItem.id,
      data: {
        duration: duration * 60,
      },
    })
    if (result.error) setError('duration', { message: 'Network error' })
  }

  const handleSubmitHourlyRateHelper = async (invoiceItemData: Pick<InvoiceItemUpdateInput, 'hourlyRate'>) => {
    const hourlyRate = invoiceItemData.hourlyRate

    const result = await updateInvoiceItem({
      id: invoiceItem.id,
      data: { hourlyRate },
    })
    if (result.error) setError('hourlyRate', { message: 'Network error' })
  }

  return (
    <tr className="[&_td]:border [&_td]:border-neutral">
      <td className="text-left">
        <span className="font-bold">{invoiceItem.task.project.title}:</span> {invoiceItem.task.title}
      </td>
      <td className="p-1">
        <InputField
          {...register('duration', { valueAsNumber: true })}
          className="input-sm input-ghost text-right"
          defaultValue={getFormattedValue(invoiceItem.duration / 60)}
          onBlur={async (event) => {
            if (event.target.value) {
              handleSubmit(handleSubmitDurationHelper)(event)
              event.target.value = getFormattedValue(parseNumericInput(event.target.value))
            } else if (taskWorkHoursResult.data?.task && taskWorkHoursResult.data.task.workHours.length > 0) {
              const totalTaskDuration = taskWorkHoursResult.data.task.workHours.reduce(
                (sum, workHour) => sum + workHour.duration,
                0,
              )
              handleSubmitDurationHelper({ duration: totalTaskDuration / 60 })
              event.target.value = getFormattedValue(totalTaskDuration / 60)
            } else {
              handleSubmitDurationHelper({ duration: 0 })
              event.target.value = getFormattedValue(0)
            }
          }}
          onFocus={(event) => event.target.select()}
          loading={fetching}
          isDirty={isDirty && dirtyFields.duration}
        />
      </td>
      <td className="p-1">
        <InputField
          {...register('hourlyRate', { valueAsNumber: true })}
          className="input-sm input-ghost text-right"
          defaultValue={getFormattedValue(Number(invoiceItem.hourlyRate))}
          onBlur={(event) => {
            if (event.target.value.length > 0) {
              const value = parseNumericInput(event.target.value)
              handleSubmit(handleSubmitHourlyRateHelper)(event)
              event.target.value = getFormattedValue(value)
            } else {
              handleSubmitHourlyRateHelper({ hourlyRate: 0 })

              event.target.value = getFormattedValue(0)
            }
          }}
          onFocus={(event) => event.target.select()}
          loading={fetching}
          isDirty={isDirty && dirtyFields.hourlyRate}
        />
      </td>
      <td>{getFormattedValue((invoiceItem.duration / 60) * invoiceItem.hourlyRate)}</td>
    </tr>
  )
}
