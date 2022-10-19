import { ErrorMessage } from '@hookform/error-message'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import {
  useWorkHourCreateMutation,
  useWorkHourUpdateMutation,
  useProjectsWithTasksQuery,
  useWorkHourDeleteMutation,
  useTaskCreateMutation,
} from '../generated/graphql'
import { Button } from './button/button'
import { HourInput } from './hourInput'
import { InputField } from './inputField/inputField'
import { Modal } from './modal'

interface BookWorkHourModalProps {
  workHourItem: WorkHourItem
  onClose: () => void
}

export interface WorkHourItem {
  workHourId?: string
  date: Date
  duration: number
  projectId: string
  taskId: string
  taskTitle?: string
}

const CREATE_NEW_TASK = 'CREATE-NEW-TASK'

const bookWorkHourModalSchema: yup.SchemaOf<WorkHourItem> = yup.object({
  workHourId: yup.string(),
  date: yup.date().required(),
  duration: yup
    .number()
    .required()
    .max(24 * 60)
    .positive(),
  projectId: yup.string().required('Project is required'),
  taskId: yup.string().required('Task is required'),
  taskTitle: yup
    .string()
    .trim()
    .when('taskId', {
      //When create new task is selected, task title is required
      is: CREATE_NEW_TASK,
      // eslint-disable-next-line unicorn/no-thenable
      then: (schema) =>
        schema.min(4, 'task title must be at least 4 characters').max(50, 'task title must be at most 50 characters'),
    }),
})

export const BookWorkHourModal = (props: BookWorkHourModalProps): JSX.Element => {
  const { onClose, workHourItem } = props
  const router = useRouter()
  const slug = router.query.teamSlug?.toString() ?? ''
  const [{ data }] = useProjectsWithTasksQuery({ variables: { slug } })
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<WorkHourItem>({
    defaultValues: workHourItem,
    shouldUnregister: false,
    resolver: yupResolver(bookWorkHourModalSchema),
  })
  const [, createWorkHour] = useWorkHourCreateMutation()
  const [, updateWorkHour] = useWorkHourUpdateMutation()
  const [, deleteWorkHour] = useWorkHourDeleteMutation()
  const [, taskCreate] = useTaskCreateMutation()

  const handleSubmitHelper = async (data: WorkHourItem) => {
    if (!data.taskId) {
      throw new Error('no Task selected')
    }

    let taskId = data.taskId
    //if there is no selected task, create a new task
    if (data.taskId === CREATE_NEW_TASK) {
      const taskResult = await taskCreate({
        data: {
          projectId: data.projectId ?? '',
          title: data.taskTitle ?? '',
        },
      })

      if (taskResult.data) {
        taskId = taskResult.data.taskCreate.id
      } else {
        throw new Error('Task not created')
      }
    }

    const workHourInput = {
      duration: data.duration,
      taskId,
      date: format(data.date, 'yyyy-MM-dd'),
    }

    const result = await (!data.workHourId
      ? createWorkHour({ data: workHourInput })
      : updateWorkHour({
          id: data.workHourId,
          data: workHourInput,
        }))

    if (!result.error) {
      onClose()
    }
  }

  const [currentProjectId, currentTaskId] = watch(['projectId', 'taskId'])
  const selectedProject = data?.teamBySlug.projects.find((project) => project.id === currentProjectId)

  useEffect(() => {
    const isTaskFromSelectedProject = selectedProject?.tasks.some((task) => task.id === currentTaskId)
    if (!isTaskFromSelectedProject) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setValue('taskId', '')
    }
  }, [currentProjectId, selectedProject])

  if (!data) {
    return <div>Loading...</div>
  }

  const handleDelete = async () => {
    if (!workHourItem.workHourId) {
      throw new Error('No workHour item id')
    }
    await deleteWorkHour({ id: workHourItem.workHourId })
    onClose()
  }

  return (
    <Modal
      title={workHourItem.workHourId ? 'Edit booked hours' : 'Book hours'}
      actions={
        <>
          <Button className="w-full" variant="primary" form="book-work-hour" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button className="w-full" variant="secondary" disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          {workHourItem.workHourId && (
            <Button className="w-full" variant="tertiary" disabled={isSubmitting} onClick={handleDelete}>
              Delete
            </Button>
          )}
        </>
      }
      variant="twoColumns"
    >
      <form className="w-full" id="book-work-hour" onSubmit={handleSubmit(handleSubmitHelper)}>
        <input type="hidden" {...register('date')} />
        <input type="hidden" {...register('workHourId')} />
        <div className="mb-4 flex flex-col">
          <select
            aria-label="Project"
            className="w-full rounded-md dark:bg-slate-800"
            id="projectId"
            {...register('projectId', { required: 'Project is required' })}
          >
            <option value="" disabled>
              Please Select
            </option>
            {data.teamBySlug.projects.map((project) => {
              return (
                <option value={project.id} key={project.id}>
                  {project.title}
                </option>
              )
            })}
          </select>
          <ErrorMessage errors={errors} name="projectId" as={<span className="text-red-700" />} />
        </div>
        <div className="mb-4 flex flex-col">
          <label>
            <select aria-label="Task" className="w-full rounded-md dark:bg-slate-800" {...register('taskId')}>
              <option value="" disabled>
                Please Select
              </option>
              {selectedProject && <option value={CREATE_NEW_TASK}>Create a new task</option>}
              {selectedProject?.tasks.map((task) => {
                return (
                  <option value={task.id} key={task.id}>
                    {task.title}
                  </option>
                )
              })}
            </select>
          </label>
          <ErrorMessage errors={errors} name="taskId" as={<span className="text-red-700" />} />
        </div>
        <div className="flex flex-col gap-y-4 rounded-md dark:bg-slate-800">
          {currentTaskId === CREATE_NEW_TASK && (
            <div className="mb-4 flex flex-col">
              <InputField
                variant="primary"
                className="dark:bg-slate-800 dark:text-white"
                placeholder="Enter task name"
                {...register('taskTitle')}
              />
              <ErrorMessage errors={errors} name="taskTitle" as={<span className="text-red-700" />} />
            </div>
          )}
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <HourInput
                  className="self-end"
                  workHours={field.value / 60}
                  onChange={(workHours: number) => {
                    setValue('duration', workHours * 60, { shouldValidate: true })
                  }}
                />
              )
            }}
            name="duration"
          />
          <ErrorMessage errors={errors} name="duration" as={<span className="text-red-700" />} />
        </div>
      </form>
    </Modal>
  )
}
