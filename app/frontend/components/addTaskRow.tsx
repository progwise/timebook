import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { useWorkHourCreateMutation, useProjectsWithTasksQuery, useTaskCreateMutation } from '../generated/graphql'
import { Button } from './button/button'
import { InputField } from './inputField/inputField'
import { Modal } from './modal'
import { ErrorMessage } from '@hookform/error-message'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'

interface AddTaskRowModalProps {
  workHourItem: WorkHourItem
  onClose: () => void
}

export interface WorkHourItem {
  date: Date
  projectId: string
  taskId: string
  taskTitle?: string
}

const CREATE_NEW_TASK = 'CREATE-NEW-TASK'

const addTaskRowSchema: yup.SchemaOf<WorkHourItem> = yup.object({
  workHourId: yup.string(),
  date: yup.date().required(),
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

export const AddTaskRowModal = (props: AddTaskRowModalProps): JSX.Element => {
  const { onClose, workHourItem } = props
  const [{ data }] = useProjectsWithTasksQuery()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<WorkHourItem>({
    defaultValues: workHourItem,
    shouldUnregister: false,
    resolver: yupResolver(addTaskRowSchema),
  })
  const [, createWorkHour] = useWorkHourCreateMutation()
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
      taskId,
      duration: 0,
      date: format(data.date, 'yyyy-MM-dd'),
    }

    const result = await createWorkHour({ data: workHourInput })
    if (!result.error) {
      onClose()
    }
  }

  const [currentProjectId, currentTaskId] = watch(['projectId', 'taskId'])
  const selectedProject = data?.projects.find((project) => project.id === currentProjectId)

  useEffect(() => {
    const isTaskFromSelectedProject = selectedProject?.tasks.some((task) => task.id === currentTaskId)
    if (!isTaskFromSelectedProject) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      setValue('taskId', '')
    }
  }, [currentProjectId, selectedProject])

  if (!data?.projects) {
    return <div>Loading...</div>
  }

  return (
    <Modal
      title="Add Row"
      actions={
        <>
          <Button className="w-full" variant="primary" form="book-work-hour" type="submit" disabled={isSubmitting}>
            Submit
          </Button>
          <Button className="w-full" variant="secondary" disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
        </>
      }
      variant="twoColumns"
    >
      <form className="w-full" id="book-work-hour" onSubmit={handleSubmit(handleSubmitHelper)}>
        <input type="hidden" {...register('date')} />
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
            {data?.projects.map((project) => {
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
        </div>
      </form>
    </Modal>
  )
}
