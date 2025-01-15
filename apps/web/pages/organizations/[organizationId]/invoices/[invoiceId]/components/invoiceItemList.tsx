import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa6'
import { useMutation } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceListInvoiceFragment = graphql(`
  fragment InvoiceListInvoice on Invoice {
    id
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
  }
`)

const InvoiceItemsListInvoiceFragment = graphql(`
  fragment InvoiceItemsListInvoice on InvoiceItem {
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

const InvoiceItemCreateMutationDocument = graphql(`
  mutation invoiceItemCreate($data: InvoiceItemInput!) {
    invoiceItemCreate(data: $data) {
      id
    }
  }
`)

const InvoiceItemUpdateMutationDocument = graphql(`
  mutation invoiceItemUpdate($id: ID!, $data: InvoiceItemInput!) {
    invoiceItemUpdate(id: $id, data: $data) {
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
  invoice: FragmentType<typeof InvoiceListInvoiceFragment>
  invoiceItems: FragmentType<typeof InvoiceItemsListInvoiceFragment>[]
}

export const InvoiceItemList = ({ invoice, invoiceItems }: InvoiceItemListProps): JSX.Element => {
  const invoiceData = useFragment(InvoiceListInvoiceFragment, invoice)
  const invoiceItemsData = useFragment(InvoiceItemsListInvoiceFragment, invoiceItems)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty, dirtyFields },
  } = useForm<InvoiceItemFormData>({
    resolver: zodResolver(invoiceItemInputSchema),
    defaultValues: { duration: 0, hourlyRate: 0 },
  })
  const [, invoiceItemCreate] = useMutation(InvoiceItemCreateMutationDocument)
  const [, invoiceItemUpdate] = useMutation(InvoiceItemUpdateMutationDocument)
  const [amount, setAmount] = useState<number>(0)

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

      setAmount(0)
      reset()
    } catch {}
  }

  const handleBlur = () => {
    const { duration, hourlyRate } = getValues()
    const amount = duration * hourlyRate || 0
    setAmount(amount)
  }

  const availableTasksByProject = invoiceData.organization.projects.map((project) =>
    project.tasks.filter((task) => !invoiceItemsData.some((invoiceItem) => invoiceItem.task.id === task.id)),
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
            <th className="w-1/12">Hourly Rate</th>
            <th className="w-1/12">Amount</th>
          </tr>
        </thead>
        <tbody>
          {[...invoiceItemsData]
            .sort((a, b) => {
              const projectCompare = a.task.project.title.localeCompare(b.task.project.title)
              return projectCompare === 0 ? a.task.title.localeCompare(b.task.title) : projectCompare
            })
            .map((invoiceItem) => (
              <tr key={invoiceItem.id} className="[&_td]:border [&_td]:border-neutral">
                <td className="text-left">
                  <span className="font-bold">{invoiceItem.task.project.title}:</span> {invoiceItem.task.title}
                </td>
                <td className="p-1">
                  <InputField
                    className="input-sm input-ghost text-right"
                    type="number"
                    defaultValue={invoiceItem.hourlyRate.toString()}
                    disabled={isSubmitting}
                    onBlur={(event) => {
                      const newDuration = Number(event.target.value)
                      invoiceItemUpdate({
                        data: {
                          duration: newDuration,
                          taskId: invoiceItem.task.id,
                          hourlyRate: Number(invoiceItem.hourlyRate),
                          invoiceId: invoiceData.id,
                        },
                        id: invoiceItem.id,
                      })
                    }}
                  />
                </td>
                <td className="p-1">
                  <InputField
                    className="input-sm input-ghost text-right"
                    type="number"
                    defaultValue={invoiceItem.hourlyRate.toString()}
                    disabled={isSubmitting}
                    onBlur={(event) => {
                      const newHourlyRate = Number(event.target.value)
                      invoiceItemUpdate({
                        data: {
                          duration: invoiceItem.duration,
                          taskId: invoiceItem.task.id,
                          hourlyRate: newHourlyRate,
                          invoiceId: invoiceData.id,
                        },
                        id: invoiceItem.id,
                      })
                    }}
                  />
                </td>
                <td>€ {(invoiceItem.duration * invoiceItem.hourlyRate) / 60}</td>
              </tr>
            ))}
        </tbody>
        <tfoot className="text-sm text-base-content">
          <tr className="font-normal print:hidden [&_td]:border [&_td]:border-neutral">
            <td className="p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <select
                  className={`select select-bordered select-sm w-full ${dirtyFields.taskId ? 'select-warning' : ''} disabled:text-opacity-100`}
                  {...register('taskId', { disabled: isSubmitting })}
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
                  className="input-sm text-right"
                  type="number"
                  placeholder="Enter a duration"
                  {...register('duration', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.duration?.message}
                  isDirty={isDirty && dirtyFields.duration}
                  onBlur={handleBlur}
                />
              </form>
            </td>
            <td className="p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  className="input-sm text-right"
                  type="number"
                  placeholder="Enter an hourly rate"
                  {...register('hourlyRate', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.hourlyRate?.message}
                  isDirty={isDirty && dirtyFields.hourlyRate}
                  onBlur={handleBlur}
                />
              </form>
            </td>
            <td>{amount}</td>
          </tr>
        </tfoot>
      </table>
      <div className="pt-2 text-end">
        <button
          className="btn btn-success btn-sm print:hidden"
          type="submit"
          disabled={isSubmitting}
          form="form-create-invoice-item"
        >
          <FaPlus /> Add
        </button>
        <div className="pt-2 font-bold">
          Total: € {invoiceItemsData.reduce((sum, item) => sum + item.duration * item.hourlyRate, 0)}
        </div>
      </div>
    </>
  )
}
