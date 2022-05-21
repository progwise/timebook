import { format, parse } from 'date-fns'
import { useForm, Controller } from 'react-hook-form'
import { ProjectFragment, ProjectInput } from '../../generated/graphql'
import { CalendarSelector } from '../calendarSelector'
import InputMask from 'react-input-mask'
import * as yup from 'yup'
import { Button } from '../button/button'
import { DeleteProjectModal } from '../deleteProjectModal'
import { useState } from 'react'
import { InputField } from '../inputField/inputField'
import { BiTrash } from 'react-icons/bi'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
  acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

const projectInputSchema: yup.SchemaOf<ProjectInput> = yup.object({
  customerId: yup.string(),
  title: yup.string().trim().required().max(20),
  start: yup.string(),
  end: yup.string(),
})

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => Promise<void>
  onCancel: () => void
  project?: ProjectFragment & { canModify: boolean }
  hasError: boolean
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
  const { project, onSubmit, onCancel, hasError } = props
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { register, handleSubmit, formState, setValue, control } = useForm<ProjectInput>({
    defaultValues: {
      title: project?.title,
      start: project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : '',
      end: project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : '',
    },
    resolver: yupResolver(projectInputSchema),
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
    <form className="mt-4 flex flex-row flex-wrap gap-2" onSubmit={handleSubmit(handleSubmitHelper)}>
      {isNewProject ? (
        <h2 className="w-full text-lg font-semibold text-gray-400">Create new project</h2>
      ) : (
        <h2 className="w-full text-lg font-semibold text-gray-400">Edit project</h2>
      )}
      <label className="mt-4 flex w-full flex-col">
        <span className="w-full text-sm text-gray-700">Name</span>
        <InputField
          variant="primary"
          disabled={formState.isSubmitting}
          readOnly={isProjectFormReadOnly}
          {...register('title')}
          placeholder="Enter project name"
        />
        <ErrorMessage errors={formState.errors} name="title" as={<span className="text-red-700" />} />
      </label>
      <label className="flex flex-1 flex-col flex-wrap">
        <span className="w-full text-sm text-gray-700">Start</span>
        <Controller
          control={control}
          rules={{ validate: (value) => !value || isValidDateString(value) }}
          name="start"
          render={({ field: { onChange, onBlur, value } }) => (
            <div className="flex items-center">
              <InputMask
                disabled={formState.isSubmitting}
                mask="9999-99-99"
                onBlur={onBlur}
                onChange={onChange}
                value={value ?? undefined}
                readOnly={isProjectFormReadOnly}
                id="start"
                type="text"
                size={10}
                className="font-small rounded"
              />
              <CalendarSelector
                disabled={formState.isSubmitting}
                className="shrink-0"
                hideLabel={true}
                onSelectedDateChange={(newDate) => setValue('start', format(newDate, 'yyyy-MM-dd'))}
              />
            </div>
          )}
        />
        {formState.errors.start && <span className="whitespace-nowrap">Invalid Date</span>}
      </label>
      <label className="flex flex-1 flex-col flex-wrap">
        <span className="w-full text-sm text-gray-700">End</span>
        <Controller
          control={control}
          rules={{ validate: (value) => !value || isValidDateString(value) }}
          name="end"
          render={({ field: { onChange, onBlur, value } }) => (
            <div className="flex items-center">
              <InputMask
                mask="9999-99-99"
                disabled={formState.isSubmitting}
                onBlur={onBlur}
                readOnly={isProjectFormReadOnly}
                onChange={onChange}
                value={value ?? undefined}
                id="end"
                type="text"
                size={10}
                className="font-small rounded"
              />
              <CalendarSelector
                disabled={formState.isSubmitting}
                className="shrink-0"
                hideLabel={true}
                onSelectedDateChange={(newDate) => setValue('end', format(newDate, 'yyyy-MM-dd'))}
              />
            </div>
          )}
        />

        {formState.errors.end && <span className="whitespace-nowrap">Invalid Date</span>}
      </label>
      <div className="mt-8 flex w-full justify-center gap-2">
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
          <DeleteProjectModal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} project={project} />
        ) : undefined}
        {hasError && <span className="display: inline-block pt-5 text-red-600">Unable to save project.</span>}
      </div>
    </form>
  )
}
