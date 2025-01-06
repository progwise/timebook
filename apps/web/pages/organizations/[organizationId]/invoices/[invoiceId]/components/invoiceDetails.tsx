import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus, FaPrint } from 'react-icons/fa6'
import { useMutation } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceFragment = graphql(`
  fragment InvoiceFragment on Invoice {
    id
    invoiceDate
    customerName
    customerAddress
    payDate
    sendDate
    invoiceStatus
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

const InvoiceItemsFragment = graphql(`
  fragment InvoiceItemsFragment on InvoiceItem {
    id
    duration
    hourlyRate
    task {
      id
      title
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

interface InvoiceDetailsProps {
  invoice: FragmentType<typeof InvoiceFragment>
  invoiceItems: FragmentType<typeof InvoiceItemsFragment>[]
}

export const InvoiceDetails = ({ invoice, invoiceItems }: InvoiceDetailsProps) => {
  const invoiceData = useFragment(InvoiceFragment, invoice)
  const invoiceItemsData = useFragment(InvoiceItemsFragment, invoiceItems)
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
    <div className="flex flex-col gap-4 rounded-lg p-4 text-sm shadow-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4">
          <div>
            <Image className="m-auto" src="/logo-progwise.svg" alt="Progwise logo" width={60} height={60} />
            <p className="text-lg font-bold">Progwise</p>
            <p>Greifswald</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Billed to:</h2>
            <p>{invoiceData.customerName}</p>
            <p>{invoiceData.customerAddress}</p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="text-right">
            <button className="btn btn-primary btn-sm print:hidden" onClick={() => print()}>
              <FaPrint />
              Print
            </button>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">Invoice</div>
              <span className="badge badge-neutral badge-lg print:hidden">{invoiceData.invoiceStatus}</span>
            </div>
            <p>Invoice No: #{invoiceData.id}</p>
            <p className="text-right">Invoice Date: {invoiceData.invoiceDate}</p>
          </div>
        </div>
      </div>

      <table className="table">
        <thead className="bg-neutral text-sm text-neutral-content">
          <tr>
            <th className="border border-neutral">Item</th>
            <th className="w-1/12 border border-neutral">Duration</th>
            <th className="w-1/12 border border-neutral">Hourly Rate</th>
            <th className="w-1/12 border border-neutral text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItemsData.map((invoiceItem) => (
            <tr key={invoiceItem.id}>
              <td className="border border-neutral">{invoiceItem.task.title}</td>
              <td className="border border-neutral">{invoiceItem.duration}</td>
              <td className="border border-neutral">{invoiceItem.hourlyRate}</td>
              <td className="border border-neutral text-right">{invoiceItem.duration * invoiceItem.hourlyRate}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="text-sm text-base-content">
          <tr className="font-normal print:hidden">
            <td className="border border-neutral p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <select
                  className={`select select-bordered select-sm w-full ${dirtyFields.taskId ? 'select-warning' : ''} disabled:text-opacity-100`}
                  {...register('taskId', { disabled: isSubmitting })}
                >
                  {availableTasksByProject.length === 0 ? (
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
            <td className="border border-neutral p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  className="input-sm"
                  type="number"
                  placeholder="Enter a duration"
                  {...register('duration', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.duration?.message}
                  isDirty={isDirty && dirtyFields.duration}
                  onBlur={handleBlur}
                />
              </form>
            </td>
            <td className="border border-neutral p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  className="input-sm"
                  type="number"
                  placeholder="Enter an hourly rate"
                  {...register('hourlyRate', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.hourlyRate?.message}
                  isDirty={isDirty && dirtyFields.hourlyRate}
                  onBlur={handleBlur}
                />
              </form>
            </td>
            <td className="border border-neutral text-right">{amount}</td>
          </tr>
        </tfoot>
      </table>
      <div className="text-end">
        <button
          className="btn btn-success btn-sm print:hidden"
          type="submit"
          disabled={isSubmitting}
          form="form-create-invoice-item"
        >
          <FaPlus /> Add
        </button>
        <div className="pt-2 font-bold">
          Total €{invoiceItemsData.reduce((sum, item) => sum + item.duration * item.hourlyRate, 0)}
        </div>
      </div>
      <div>
        <p className="font-bold">
          Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
        </p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
