import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { invoiceItemInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../../../../../frontend/generated/gql'
import { InvoiceItemInput } from '../../../../../../frontend/generated/gql/graphql'

const InvoiceListInvoiceFragment = graphql(`
  fragment InvoiceListInvoice on Invoice {
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

const TaskWorkHoursQuery = graphql(`
  query TaskWorkHours($id: ID!, $from: Date!, $to: Date!) {
    task(taskId: $id) {
      id
      workHours(from: $from, to: $to) {
        id
        duration
      }
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

const getFormattedDuration = (duration: number): string => {
  if (duration === 0) {
    return '0,00'
  }

  const hours = Math.floor(duration / 60)
  const minutes = ((duration % 60) / 60).toFixed(2).split('.')[1]
  return `${hours},${minutes}`
}

export const InvoiceItemList = ({ invoice, invoiceItems }: InvoiceItemListProps): JSX.Element => {
  const invoiceData = useFragment(InvoiceListInvoiceFragment, invoice)
  const invoiceItemsData = useFragment(InvoiceItemsListInvoiceFragment, invoiceItems)
  const context = useMemo(() => ({ additionalTypenames: ['InvoiceItem', 'Invoice'] }), [])
  const [amount, setAmount] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const [, invoiceItemCreate] = useMutation(InvoiceItemCreateMutationDocument)
  const [, invoiceItemUpdate] = useMutation(InvoiceItemUpdateMutationDocument)

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

  const [workHoursResult] = useQuery({
    query: TaskWorkHoursQuery,
    variables: {
      id: invoiceItemsData[0]?.task.id || '',
      from: invoiceData.invoiceWorkFrom,
      to: invoiceData.invoiceWorkUntil,
    },
    context,
    pause: invoiceItemsData.length === 0,
  })

  const workHoursQueries = invoiceItemsData.map((item) => ({
    taskId: item.task.id,
    query: workHoursResult,
  }))

  const workHoursMap = Object.fromEntries(workHoursQueries.map(({ taskId, query }) => [taskId, query.data]))

  useEffect(() => {
    const newTotal = invoiceItemsData.reduce((sum, item) => sum + (item.duration * item.hourlyRate) / 60, 0)
    setTotal(newTotal)
  }, [invoiceItemsData])

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
    } catch (error) {
      alert(error)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement
    const isInForm = relatedTarget?.closest('#form-create-invoice-item')

    if (!isInForm) {
      const { taskId, duration, hourlyRate } = getValues()
      if (taskId && duration && hourlyRate) {
        const durationInMinutes = duration * 60
        void handleSubmit((data) =>
          handleAddInvoiceItem({
            ...data,
            duration: durationInMinutes,
          }),
        )()
      }
    }
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
                    type="text"
                    defaultValue={getFormattedDuration(invoiceItem.duration)}
                    disabled={isSubmitting}
                    onBlur={(event) => {
                      let newDuration = Number(event.target.value)
                      const taskWorkHours = workHoursMap[invoiceItem.task.id]?.task
                      if (!newDuration && taskWorkHours) {
                        const totalTaskDuration = taskWorkHours.workHours.reduce(
                          (sum, workHour) => sum + workHour.duration,
                          0,
                        )
                        newDuration = totalTaskDuration / 60
                      }
                      event.target.value = getFormattedDuration(newDuration * 60)
                      invoiceItemUpdate({
                        data: {
                          duration: newDuration * 60,
                          taskId: invoiceItem.task.id,
                          hourlyRate: Number(invoiceItem.hourlyRate),
                          invoiceId: invoiceData.id,
                        },
                        id: invoiceItem.id,
                      })
                    }}
                    onFocus={(event) => event.target.select()}
                  />
                </td>
                <td className="p-1">
                  <div className="relative">
                    <span className="absolute left-2 top-1.5">€</span>
                    <InputField
                      className="input-sm input-ghost text-right"
                      type="text"
                      defaultValue={Number(invoiceItem.hourlyRate).toFixed(2).toString()}
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
                      onFocus={(event) => event.target.select()}
                    />
                  </div>
                </td>
                <td>€ {((invoiceItem.duration * invoiceItem.hourlyRate) / 60).toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
        <tfoot className="text-sm text-base-content">
          <tr className="font-normal print:hidden [&_td]:border [&_td]:border-neutral">
            <td className="p-1">
              <form
                onSubmit={handleSubmit(handleAddInvoiceItem)}
                id="form-create-invoice-item"
                {...register('taskId', { disabled: isSubmitting })}
                {...register('taskId', { disabled: isSubmitting })}
              >
                <select
                  className={`select select-bordered select-sm w-full ${dirtyFields.taskId ? 'select-warning' : ''} disabled:text-opacity-100`}
                  {...register('taskId', { disabled: isSubmitting })}
                  disabled={isSubmitting}
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
                  className="input-sm input-ghost text-right"
                  type="number"
                  placeholder="Duration"
                  defaultValue={getFormattedDuration(0)}
                  {...register('duration', { disabled: isSubmitting, valueAsNumber: true })}
                  errorMessage={errors.duration?.message}
                  isDirty={isDirty && dirtyFields.duration}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  onFocus={(event) => event.target.select()}
                />
              </form>
            </td>
            <td className="p-1">
              <form onSubmit={handleSubmit(handleAddInvoiceItem)} id="form-create-invoice-item">
                <div className="relative">
                  <span className="absolute left-2 top-1.5">€</span>
                  <InputField
                    className="input-sm input-ghost text-right"
                    type="number"
                    placeholder="Hourly rate"
                    defaultValue={getFormattedDuration(0)}
                    {...register('hourlyRate', { disabled: isSubmitting, valueAsNumber: true })}
                    errorMessage={errors.hourlyRate?.message}
                    isDirty={isDirty && dirtyFields.hourlyRate}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    onFocus={(event) => event.target.select()}
                  />
                </div>
              </form>
            </td>

            <td>€ {amount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <div className="pt-2 text-end font-bold">Total: € {total.toFixed(2)}</div>
    </>
  )
}
