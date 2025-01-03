/* eslint-disable unicorn/no-null */
import { ErrorMessage } from '@hookform/error-message'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, isValid, parse, parseISO } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'
import InputMask from 'react-input-mask'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'
import { projectInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { ProjectInput } from '../../generated/gql/graphql'
import { CalendarSelector } from '../calendarSelector'
import { PageHeading } from '../pageHeading'
import { ProjectInvitationButton } from '../projectInvitationButton'
import { DeleteOrArchiveProjectButton } from './deleteOrArchiveProjectButton'

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
    if (!arguments_.end) {
      return
    }
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
    id
    startDate
    endDate
    canModify
    hasWorkHours
    organization {
      id
      title
      isArchived
    }
    ...DeleteOrArchiveProjectButton
    ...ProjectInvitationButton
  }
`)

export const OrganizationFragment = graphql(`
  fragment Organization on Organization {
    id
    title
    isArchived
  }
`)

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => Promise<void>
  onCancel: () => void
  project?: FragmentType<typeof ProjectFormFragment>
  hasError: boolean
  organizations: FragmentType<typeof OrganizationFragment>[]
}

export const ProjectForm = (props: ProjectFormProps): JSX.Element => {
  const { onSubmit, onCancel, hasError } = props
  const project = useFragment(ProjectFormFragment, props.project)
  const organizations = useFragment(OrganizationFragment, props.organizations)
  const { register, handleSubmit, formState, setValue, control } = useForm<ProjectInput>({
    defaultValues: {
      title: project?.title,
      start: project?.startDate ? format(new Date(project.startDate), 'yyyy-MM-dd') : null,
      end: project?.endDate ? format(new Date(project.endDate), 'yyyy-MM-dd') : null,
      organizationId: project?.organization?.id ?? '',
    },
    resolver: zodResolver(projectInputSchema),
  })

  const { isSubmitting, errors, dirtyFields } = formState

  const handleSubmitHelper = (data: ProjectInput) => {
    return onSubmit({
      ...data,
      end: data.end?.length ? data.end : null,
      start: data.start?.length ? data.start : null,
      organizationId: data.organizationId || null,
    })
  }

  const isProjectFormReadOnly = !project?.canModify && !!project

  return (
    <div className="flex flex-wrap items-start gap-2">
      <form onSubmit={handleSubmit(handleSubmitHelper)} className="contents" id="project-form">
        {project ? <PageHeading>Project {project.title}</PageHeading> : <PageHeading>Create new project</PageHeading>}
        <InputField
          label="Name"
          type="text"
          readOnly={isProjectFormReadOnly}
          {...register('title', { disabled: isSubmitting })}
          placeholder="Enter project name"
          size={30}
          errorMessage={errors.title?.message}
          isDirty={dirtyFields.title}
        />
        <div>
          <div className="form-control">
            <div className="label">
              <label htmlFor="start" className="label-text">
                Start
              </label>
            </div>
            <Controller
              control={control}
              rules={{ validate: (value) => !value || isValidDateString(value) }}
              name="start"
              render={({ field: { onChange, onBlur, value } }) => (
                <div className="flex items-center">
                  <InputMask
                    disabled={isSubmitting}
                    mask="9999-99-99"
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value ?? ''}
                    readOnly={isProjectFormReadOnly}
                    id="start"
                    type="text"
                    size={10}
                    className="input input-bordered py-1"
                  />
                  <CalendarSelector
                    disabled={isSubmitting || isProjectFormReadOnly}
                    className="shrink-0 pl-1"
                    date={getDate(value)}
                    hideLabel={true}
                    onDateChange={(newDate) => setValue('start', format(newDate, 'yyyy-MM-dd'))}
                  />
                </div>
              )}
            />
            <div className="label">
              <ErrorMessage
                name="start"
                errors={errors}
                as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="form-control">
            <div className="label">
              <label htmlFor="end" className="label-text">
                End
              </label>
            </div>
            <Controller
              control={control}
              rules={{ validate: (value) => !value || isValidDateString(value) }}
              name="end"
              render={({ field: { onChange, onBlur, value } }) => (
                <div className="flex items-center">
                  <InputMask
                    mask="9999-99-99"
                    disabled={isSubmitting}
                    onBlur={onBlur}
                    readOnly={isProjectFormReadOnly}
                    onChange={onChange}
                    value={value ?? ''}
                    id="end"
                    type="text"
                    size={10}
                    className="input input-bordered py-1"
                  />
                  <CalendarSelector
                    disabled={isSubmitting || isProjectFormReadOnly}
                    className="shrink-0 pl-1"
                    date={getDate(value)}
                    hideLabel={true}
                    onDateChange={(newDate) => setValue('end', format(newDate, 'yyyy-MM-dd'))}
                  />
                </div>
              )}
            />
            <div className="label">
              <ErrorMessage
                name="end"
                errors={errors}
                as={<span role="alert" className="label-text-alt whitespace-nowrap text-error" />}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Organization</span>
            </div>
            <select
              className={`select select-bordered w-full max-w-xs ${dirtyFields.organizationId ? 'select-warning' : ''} disabled:text-opacity-100`}
              {...register('organizationId', { disabled: isSubmitting || isProjectFormReadOnly })}
            >
              <option value="">No organization</option>
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.title} {organization.isArchived && '(archived)'}
                </option>
              ))}
              {project?.organization &&
                !organizations.some((organization) => organization.id === project?.organization?.id) && (
                  <option value={project.organization.id}>
                    {project.organization.title} {project.organization.isArchived && '(archived)'}
                  </option>
                )}
            </select>
          </label>
        </div>
      </form>
      <div className="flex w-full gap-2">
        <button
          className="btn btn-secondary btn-sm"
          disabled={isSubmitting}
          onClick={onCancel}
          title="Cancel the changes"
          type="button"
        >
          Cancel
        </button>
        {project?.canModify && <DeleteOrArchiveProjectButton project={project} disabled={isSubmitting} />}
        {!isProjectFormReadOnly && (
          <button
            className="btn btn-primary btn-sm"
            type="submit"
            disabled={isSubmitting}
            title={project ? 'Save' : 'Create'}
            form="project-form"
          >
            {project ? 'Save' : 'Create'}
          </button>
        )}
        {hasError && <span className="display: inline-block pt-5 text-red-600">Unable to save project.</span>}

        {project?.canModify && <ProjectInvitationButton projectId={project.id} project={project} />}
      </div>
    </div>
  )
}
