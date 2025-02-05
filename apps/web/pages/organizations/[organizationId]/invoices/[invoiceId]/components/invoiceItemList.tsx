import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemInput } from '../../../../../../frontend/generated/gql/graphql'
import { getFormattedValue, parseNumericInput } from './invoiceFormatUtils'
import { InvoiceItemListRow } from './invoiceItemListRow'

const InvoiceItemListInvoiceFragment = graphql(`
  fragment InvoiceItemListInvoice on Invoice {
    id
    invoiceWorkFrom
    invoiceWorkUntil
    organization {
      id
      projects {
        id
        title
        tasks {
          id
          title
        }
      }
    }
    invoiceItems {
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
      ...InvoiceItemListRow
    }
  }
`)

const InvoiceItemCreateMutationDocument = graphql(`
  mutation invoiceItemCreate($data: InvoiceItemInput!) {
    invoiceItemCreate(data: $data) {
      id
    }
  }
`)

export type InvoiceItemFormData = Pick<InvoiceItemInput, 'taskId' | 'duration' | 'hourlyRate'>

export const invoiceItemInputSchema: z.ZodSchema<InvoiceItemFormData> = invoiceItemInputValidations.pick({
  taskId: true,
  duration: true,
  hourlyRate: true,
})

export interface InvoiceItemListProps {
  invoice: FragmentType<typeof InvoiceItemListInvoiceFragment>
}

export const InvoiceItemList = ({ invoice }: InvoiceItemListProps): JSX.Element => {
  const invoiceData = useFragment(InvoiceItemListInvoiceFragment, invoice)

  const [total, setTotal] = useState<number>(0)
  const [footerAmount, setFooterAmount] = useState<number>(0)
  const [, invoiceItemCreate] = useMutation(InvoiceItemCreateMutationDocument)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { isSubmitting, errors, isDirty, dirtyFields },
  } = useForm<InvoiceItemFormData>({
    resolver: zodResolver(invoiceItemInputSchema),
  })

  useEffect(() => {
    const newTotal = invoiceData.invoiceItems.reduce((sum, item) => sum + (item.duration * item.hourlyRate) / 60, 0)
    setTotal(newTotal)
  }, [invoiceData.invoiceItems])

  useEffect(() => {
    const { duration = 0, hourlyRate = 0 } = getValues()
    const validDuration = Number.isNaN(duration) ? 0 : duration
    const validHourlyRate = Number.isNaN(hourlyRate) ? 0 : hourlyRate
    const newFooterAmount = validDuration * validHourlyRate
    setFooterAmount(newFooterAmount)
  }, [getValues, watch('duration'), watch('hourlyRate')])

  const handleAddInvoiceItem = async (invoiceItemData: InvoiceItemFormData) => {
    try {
      const result = await invoiceItemCreate({
        data: {
          invoiceId: invoiceData.id,
          ...invoiceItemData,
        },
      })
      if (result.error) {
        throw new Error(`GraphQL Error ${result.error}`)
      }

      reset({
        duration: 0,
        hourlyRate: 0,
      })
      setFooterAmount(0)
    } catch (error) {
      alert(error)
    }
  }

  const handleFormSubmission = () => {
    const { taskId, duration, hourlyRate } = getValues()
    if (taskId && duration && hourlyRate) {
      handleSubmit((data) =>
        handleAddInvoiceItem({
          ...data,
          duration: duration * 60,
        }),
      )()
    }
  }

  const availableTasksByProject = invoiceData.organization.projects.map((project) =>
    project.tasks.filter((task) => !invoiceData.invoiceItems.some((invoiceItem) => invoiceItem.task.id === task.id)),
  )

  const filteredProjectsWithTasks = availableTasksByProject
    // eslint-disable-next-line unicorn/no-null
    .map((tasks, index) => (tasks.length > 0 ? index : null))
    .filter((index) => index !== null)

  return (
    <>
      <table className="table text-right">
        <thead className="bg-neutral text-sm text-neutral-content">
          <tr className="[&_th]:border [&_th]:border-neutral">
            <th />
            <th className="w-1/12">Duration</th>
            <th className="w-1/12">Hourly Rate, €</th>
            <th className="w-1/12">Amount, €</th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.invoiceItems
            .sort((a, b) => {
              const projectCompare = a.task.project.title.localeCompare(b.task.project.title)
              return projectCompare === 0 ? a.task.title.localeCompare(b.task.title) : projectCompare
            })
            .map((invoiceItem) => (
              <InvoiceItemListRow
                key={invoiceItem.id}
                invoiceItem={invoiceItem}
                workFrom={invoiceData.invoiceWorkFrom}
                workUntil={invoiceData.invoiceWorkUntil}
              />
            ))}
        </tbody>
        <tfoot className="text-sm text-base-content">
          <tr className="font-normal print:hidden [&_td]:border [&_td]:border-neutral">
            <td className="p-1">
              <form
                onSubmit={handleSubmit(handleAddInvoiceItem)}
                id="form-create-invoice-item"
                {...register('taskId', { disabled: isSubmitting })}
              >
                <select
                  className={`select select-bordered select-sm w-full ${dirtyFields.taskId ? 'select-warning' : ''} disabled:text-opacity-100`}
                  {...register('taskId', { disabled: isSubmitting })}
                  disabled={isSubmitting || filteredProjectsWithTasks.length === 0}
                >
                  {filteredProjectsWithTasks.length === 0 ? (
                    <option value="">No tasks available</option>
                  ) : (
                    <>
                      <option value="">Select a task</option>
                      {filteredProjectsWithTasks.map((index) => (
                        <optgroup
                          key={invoiceData.organization.projects[index].id}
                          label={invoiceData.organization.projects[index].title}
                        >
                          {availableTasksByProject[index].map((task) => (
                            <option key={task.id} value={task.id}>
                              {task.title}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </>
                  )}
                </select>
              </form>
            </td>
            <td className="p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  {...register('duration', { valueAsNumber: true })}
                  className="input-sm input-ghost text-right"
                  placeholder="Duration"
                  defaultValue={getFormattedValue(0)}
                  disabled={isSubmitting || filteredProjectsWithTasks.length === 0}
                  errorMessage={errors.duration?.message}
                  onBlur={(event) => {
                    event.target.value = getFormattedValue(parseNumericInput(event.target.value, 0))
                    handleFormSubmission()
                  }}
                  isDirty={isDirty && dirtyFields.duration}
                  onFocus={(event) => event.target.select()}
                  onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                      let oldValue = (event.target as HTMLInputElement).value
                      const newDuration = parseNumericInput(oldValue, 0)
                      oldValue = getFormattedValue(newDuration * 60)
                      handleFormSubmission()
                    }
                  }}
                />
              </form>
            </td>
            <td className="p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  {...register('hourlyRate', { valueAsNumber: true })}
                  className="input-sm input-ghost text-right"
                  placeholder="Hourly rate"
                  defaultValue={getFormattedValue(0)}
                  disabled={isSubmitting || filteredProjectsWithTasks.length === 0}
                  errorMessage={errors.hourlyRate?.message}
                  onBlur={(event) => {
                    event.target.value = getFormattedValue(parseNumericInput(event.target.value, 0))
                    handleFormSubmission()
                  }}
                  isDirty={isDirty && dirtyFields.hourlyRate}
                  onFocus={(event) => event.target.select()}
                  onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                      let oldHourlyRate = (event.target as HTMLInputElement).value
                      const newHourlyRate = parseNumericInput(oldHourlyRate, 0)
                      oldHourlyRate = getFormattedValue(newHourlyRate)
                      handleFormSubmission()
                    }
                  }}
                />
              </form>
            </td>
            <td>{getFormattedValue(footerAmount)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="pt-2 text-end font-bold">Total: {getFormattedValue(total)}</div>
    </>
  )
}
