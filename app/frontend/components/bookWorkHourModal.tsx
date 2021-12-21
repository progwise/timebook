import { format } from 'date-fns'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateWorkHourMutation, useProjectsQuery } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'
//import { format } from 'date-fns'

interface BookWorkHourModalProps {
  open: boolean
  onClose: () => void
  selectedDate: Date
}

interface WorkHourForm {
  projectId: string
  taskId?: string
  duration: number
  comment?: string
}

export const BookWorkHourModal = (props: BookWorkHourModalProps): JSX.Element => {
  const { open, onClose, selectedDate } = props
  const [{ data }] = useProjectsQuery()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<WorkHourForm>({ shouldUnregister: true })
  const [, bookWorkHour] = useCreateWorkHourMutation()

  const handleSubmitHelper = async (data: WorkHourForm) => {
    if (data.taskId === undefined) {
      throw new Error('Task not selected')
    }
    const bookResult = await bookWorkHour({
      duration: data.duration,
      taskId: data.taskId,
      // eslint-disable-next-line unicorn/consistent-destructuring
      date: format(selectedDate, 'yyyy-MM-dd'),
      comment: data.comment,
    })

    if (!bookResult.error) {
      onClose()
    }
  }

  const watchedProjectId = watch('projectId')

  useEffect(() => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    setValue('taskId', undefined)
  }, [watchedProjectId])

  const selectedProject = data?.projects.find((project) => project.id === watchedProjectId)

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={'New Entry'}
      actions={
        <Button variant="primarySlim" form="book-work-hour" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      }
    >
      <form className="w-full" id="book-work-hour" onSubmit={handleSubmit(handleSubmitHelper)}>
        <label>
          Project
          <select className="w-72 rounded-md" {...register('projectId')}>
            <option value="">Please Select</option>
            {data?.projects.map((project) => {
              return (
                <option value={project.id} key={project.id}>
                  {project.title}
                </option>
              )
            })}
          </select>
        </label>
        <label>
          <select className="w-72 rounded-md" {...register('taskId')}>
            {selectedProject?.tasks.map((task) => {
              return (
                <option value={task.id} key={task.id}>
                  {task.title}
                </option>
              )
            })}
          </select>
        </label>
        <label>
          <input className="w-72 rounded-md" type="text" {...register('duration', { valueAsNumber: true })} />
        </label>
        <label>
          <input className="w-72 rounded-md" placeholder="Note" type="text" {...register('comment')} />
        </label>
      </form>
    </Modal>
  )
}
