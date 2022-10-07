/* eslint-disable unicorn/no-null */
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
import { CustomerInput } from './customerInput'

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
  acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

const projectInputSchema: yup.SchemaOf<ProjectInput> = yup.object({
  customerId: yup.string().nullable(),
  title: yup.string().trim().required().max(20),
  start: yup.string().nullable(),
  end: yup.string().nullable(),
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
      start: project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : null,
      end: project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : null,
      customerId: project?.customer?.id,
    },
    resolver: yupResolver(projectInputSchema),
  })

  const handleSubmitHelper = (data: ProjectInput) => {
    return onSubmit({
      ...data,
      end: data.end?.length ? data.end : null,
      start: data.start?.length ? data.start : null,
    })
  }

  const isNewProject = !project
  const isProjectFormReadOnly = !project?.canModify && !isNewProject
  return (
    <form
      className="mt-4 flex flex-row flex-wrap items-start justify-start gap-2 "
      onSubmit={handleSubmit(handleSubmitHelper)}
    >
      {isNewProject ? (
        <h2 className="w-full text-lg font-semibold text-gray-400 dark:text-white">Create new project</h2>
      ) : (
        <h2 className="w-full text-lg font-semibold text-gray-400 ">
          {isProjectFormReadOnly ? 'View' : 'Edit'} project
        </h2>
      )}
      <label className="flex flex-1 flex-col">
        <span className="w-full text-sm text-gray-700 dark:text-white">Name</span>
        <InputField
          variant="primary"
          disabled={formState.isSubmitting}
          readOnly={isProjectFormReadOnly}
          {...register('title')}
          placeholder="Enter project name"
          size={30}
          className="font-small dark:placeholder-grey rounded read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
        />
        <ErrorMessage errors={formState.errors} name="title" as={<span className="text-red-700" />} />
      </label>
      <div className="flex flex-col">
        <label htmlFor="start" className="w-full text-sm text-gray-700 dark:text-white">
          Start
        </label>
        <Controller
          control={control}
          rules={{ validate: (value) => !value || isValidDateString(value) }}
          name="start"
          render={({ field: { onChange, onBlur, value } }) => (
            <div className="flex items-center ">
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
                className="font-small rounded pt-1 pb-1 read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
              />
              <CalendarSelector
                disabled={formState.isSubmitting || isProjectFormReadOnly}
                className="shrink-0"
                hideLabel={true}
                onSelectedDateChange={(newDate) => setValue('start', format(newDate, 'yyyy-MM-dd'))}
              />
            </div>
          )}
        />
        {formState.errors.start && <span className="whitespace-nowrap">Invalid Date</span>}
      </div>
      <div className="mb-6 flex flex-col">
        <label htmlFor="end" className="w-full text-sm text-gray-700 dark:text-white">
          End
        </label>
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
                className="font-small rounded pt-1 pb-1 read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
              />
              <CalendarSelector
                disabled={formState.isSubmitting || isProjectFormReadOnly}
                className="shrink-0"
                hideLabel={true}
                onSelectedDateChange={(newDate) => setValue('end', format(newDate, 'yyyy-MM-dd'))}
              />
            </div>
          )}
        />

        {formState.errors.end && <span className="whitespace-nowrap">Invalid Date</span>}
      </div>
      <label className="w-full">
        <h1>Customer</h1>
        <CustomerInput control={control} name="customerId" />
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
