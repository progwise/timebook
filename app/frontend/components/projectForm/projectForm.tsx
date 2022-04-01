import { format, parse } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { ProjectFragment, ProjectInput } from '../../generated/graphql'
import { CalendarSelector } from '../calendarSelector'
import InputMask from 'react-input-mask'
import { Button } from '../button/button'
import { DeleteProjectModal } from '../deleteProjectModal'
import { useState } from 'react'
import { InputField } from '../inputField/inputField'
import { BiTrash } from 'react-icons/bi'

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
  acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => Promise<void>
  onCancel: () => void
  project?: ProjectFragment
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
  const { project, onSubmit, onCancel } = props
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { register, handleSubmit, formState, setValue, control } = useForm<ProjectInput>({
    defaultValues: {
      title: project?.title,
      start: project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '',
      end: project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '',
    },
  })

  const handleSubmitHelper = (data: ProjectInput) => {
    return onSubmit({
      ...data,
      end: data.end ? data.end : undefined,
      start: data.start ? data.start : undefined,
    })
  }

  const isNewProject = !project
  const isProjectFormReadOnly = !project?.canModify && !isNewProject
  return (
    <form onSubmit={handleSubmit(handleSubmitHelper)}>
      {isNewProject ? (
        <h2 className="py-4 text-lg font-semibold text-gray-400">Create Project</h2>
      ) : (
        <h2>Edit Project</h2>
      )}
      <div className="text-gray-500">
        <label>
          <span>Name</span>
        </label>
      </div>
      <InputField
        variant="primary"
        disabled={formState.isSubmitting}
        readOnly={isProjectFormReadOnly}
        {...register('title', { required: true })}
        placeholder="Enter project name"
      />

      {formState.errors.title && <span>Required</span>}
      <div className="flex flex-wrap gap-x-5">
        <div>
          <label htmlFor="start" className="block pl-0.5 text-gray-500">
            Start
          </label>
          <div className="flex items-center gap-x-2">
            <Controller
              control={control}
              rules={{ validate: (value) => !value || isValidDateString(value) }}
              name="start"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputMask
                  disabled={formState.isSubmitting}
                  mask="9999-99-99"
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value ?? undefined}
                  readOnly={isProjectFormReadOnly}
                  id="start"
                  type="text"
                  className="rounded"
                />
              )}
            />
            <CalendarSelector
              disabled={formState.isSubmitting}
              className="shrink-0"
              hideLabel={true}
              onSelectedDateChange={(newDate) => setValue('start', format(newDate, 'yyyy-MM-dd'))}
            />
          </div>
        </div>
        {formState.errors.start && <span className="whitespace-nowrap">Invalid Date</span>}

        <div>
          <label htmlFor="end" className="block pl-0.5 text-gray-500">
            End
          </label>
          <div className="flex items-center gap-x-2">
            <Controller
              control={control}
              rules={{ validate: (value) => !value || isValidDateString(value) }}
              name="end"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputMask
                  mask="9999-99-99"
                  disabled={formState.isSubmitting}
                  onBlur={onBlur}
                  readOnly={isProjectFormReadOnly}
                  onChange={onChange}
                  value={value ?? undefined}
                  id="end"
                  type="text"
                  className="rounded"
                />
              )}
            />
            <CalendarSelector
              disabled={formState.isSubmitting}
              className="shrink-0"
              hideLabel={true}
              onSelectedDateChange={(newDate) => setValue('end', format(newDate, 'yyyy-MM-dd'))}
            />
          </div>
          {formState.errors.end && <span className="whitespace-nowrap">Invalid Date</span>}
        </div>
      </div>
      <div className="mt-16 flex justify-center gap-2">
        {project?.canModify && (
          <Button variant="tertiary" onClick={() => setIsDeleteModalOpen(true)}>
            Delete
            <BiTrash />
          </Button>
        )}
        <Button disabled={formState.isSubmitting} variant="secondary" onClick={onCancel} tooltip="Cancel the changes">
          Cancel
        </Button>
        {!isProjectFormReadOnly && (
          <Button type="submit" variant="primary" disabled={formState.isSubmitting} tooltip="Save changes">
            Save
          </Button>
        )}
        {project ? (
          <>
            <DeleteProjectModal
              open={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              project={project}
            />
          </>
        ) : undefined}
      </div>
    </form>
  )
}
