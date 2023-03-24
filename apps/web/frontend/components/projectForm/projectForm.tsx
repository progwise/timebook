/* eslint-disable unicorn/no-null */
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse, parseISO } from 'date-fns'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BiTrash } from 'react-icons/bi'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import { Button, InputField } from '@progwise/timebook-ui'
import { projectInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { ProjectInput } from '../../generated/gql/graphql'
import { CalendarSelector } from '../calendarSelector'
import { DeleteProjectModal } from '../deleteProjectModal'

const getDate = (dateString: string | undefined | null): Date | undefined => {
  if (!dateString) {
    return undefined
  }
  const usedFormat = acceptedDateFormats.find((format) => isValid(parse(dateString, format, new Date())))
  if (!usedFormat) {
    return undefined
  }
  return parse(dateString, usedFormat, new Date().getDate())
}

const acceptedDateFormats = ['yyyy-MM-dd', 'dd.MM.yyyy', 'MM/dd/yyyy']
const isValidDateString = (dateString: string): boolean =>
  acceptedDateFormats.some((format) => parse(dateString, format, new Date()).getDate())

const projectInputSchema: z.ZodSchema<ProjectInput> = projectInputValidations
  .extend({
    start: z
      .string()
      .nullish()
      .transform((value) => (value === '____-__-__' ? null : value))
      .refine((value) => !value || isValid(parseISO(value)), 'invalid date'),
    end: z
      .string()
      .nullish()
      .transform((value) => (value === '____-__-__' ? null : value))
      .refine((value) => !value || isValid(parseISO(value)), 'invalid date'),
  })
  .superRefine((arguments_, context) => {
    const isStartBeforeEnd = (getDate(arguments_.start) || 0) <= (getDate(arguments_.end) || 1)

    if (!isStartBeforeEnd) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end'],
        message: 'The end date must be after start date',
      })
    }
  })

export const ProjectFormFragment = graphql(`
  fragment ProjectForm on Project {
    title
    startDate
    endDate
    canModify
    ...DeleteProjectModal
  }
`)

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => Promise<void>
  onCancel: () => void
  project?: FragmentType<typeof ProjectFormFragment>
  hasError: boolean
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
  const { onSubmit, onCancel, hasError } = props
  const project = useFragment(ProjectFormFragment, props.project)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { register, handleSubmit, formState, setValue, control } = useForm<ProjectInput>({
    defaultValues: {
      title: project?.title,
      start: project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : null,
      end: project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : null,
    },
    resolver: zodResolver(projectInputSchema),
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
      <InputField
        label="Name"
        variant="primary"
        disabled={formState.isSubmitting}
        readOnly={isProjectFormReadOnly}
        {...register('title')}
        placeholder="Enter project name"
        size={30}
        className="rounded read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
        errorMessage={formState.errors.title?.message}
      />

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
                value={value ?? ''}
                readOnly={isProjectFormReadOnly}
                id="start"
                type="text"
                size={10}
                className="rounded py-1 read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
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
        <ErrorMessage name="start" errors={formState.errors} as={<span role="alert" className="whitespace-nowrap" />} />
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
                value={value ?? ''}
                id="end"
                type="text"
                size={10}
                className="rounded py-1 read-only:bg-gray-100 read-only:opacity-50 dark:border-white dark:bg-slate-800 dark:text-white"
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

        <ErrorMessage name="end" errors={formState.errors} as={<span role="alert" className="whitespace-nowrap" />} />
      </div>
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
          <Button
            type="submit"
            variant="primary"
            disabled={formState.isSubmitting}
            tooltip={isNewProject ? 'Create' : 'Save'}
          >
            {isNewProject ? 'Create' : 'Save'}
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
