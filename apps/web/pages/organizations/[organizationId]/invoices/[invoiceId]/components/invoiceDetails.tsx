import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
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
  const tasks = invoiceData.organization.projects.flatMap((project) => project.tasks)
  const availableTasks = tasks.filter(
    (task) => !invoiceItemsData.some((invoiceItem) => invoiceItem.task.id === task.id),
  )
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isDirty, dirtyFields },
  } = useForm<InvoiceItemFormData>({
    resolver: zodResolver(invoiceItemInputSchema),
    defaultValues: { duration: 0, hourlyRate: 0 },
  })

  const [, invoiceItemCreate] = useMutation(InvoiceItemCreateMutationDocument)

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
      reset()
    } catch {}
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg p-4 shadow-md">
      <div className="flex justify-between text-sm">
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
              <span className="badge badge-neutral badge-lg">{invoiceData.invoiceStatus}</span>
            </div>
            <p className="text-sm text-gray-600">Invoice No: #{invoiceData.id}</p>
            <p className="text-right text-sm text-gray-600">Invoice Date: {invoiceData.invoiceDate}</p>
          </div>
        </div>
      </div>

      <table className="table">
        <thead className="bg-neutral text-sm text-neutral-content">
          <tr>
            <th className="w-2/3 border border-neutral">Item</th>
            <th className="border border-neutral">Duration</th>
            <th className="border border-neutral">Hourly Rate</th>
            <th className="border border-neutral text-right">Amount</th>
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
          <tr className="font-normal">
            <td>
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <select
                  className={`select select-bordered select-sm w-full ${dirtyFields.taskId ? 'select-warning' : ''} disabled:text-opacity-100`}
                  {...register('taskId', { disabled: isSubmitting })}
                >
                  {availableTasks.length === 0 ? (
                    <option value="">No tasks available</option>
                  ) : (
                    <>
                      <option value="">Choose the task</option>
                      {availableTasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </form>
            </td>
            <td>
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  className="input-sm"
                  type="number"
                  placeholder="Enter a duration"
                  {...register('duration', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.duration?.message}
                  isDirty={isDirty && dirtyFields.duration}
                />
              </form>
            </td>
            <td>
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <InputField
                  className="input-sm"
                  type="number"
                  placeholder="Enter an hourly rate"
                  {...register('hourlyRate', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.hourlyRate?.message}
                  isDirty={isDirty && dirtyFields.hourlyRate}
                />
              </form>
            </td>
            <td className="">
              <button
                className="btn btn-success btn-sm min-w-20"
                type="submit"
                disabled={isSubmitting}
                form="form-create-invoice-item"
              >
                <FaPlus /> Add
              </button>
            </td>
          </tr>
          <tr>
            <td colSpan={2} />
            <td className="text-right">Total</td>
            <td className="text-right">
              €{invoiceItemsData.reduce((sum, item) => sum + item.duration * item.hourlyRate, 0)}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="text-sm">
        <p className="font-bold">
          Payment method: <span className="font-normal">Bank Transfer / PayPal</span>
        </p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
