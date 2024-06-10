import { useForm } from 'react-hook-form'

import { InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { OrganizationInput } from '../../mocks/mocks.generated'
import { PageHeading } from '../pageHeading'
import { ArchiveOrUnarchiveOrganizationButton } from './archiveOrUnarchiveOrganizationButton/archiveOrUnarchiveOrganizationButton'

export const OrganizationFormFragment = graphql(`
  fragment OrganizationForm on Organization {
    title
    address
    canModify
    ...ArchiveOrUnarchiveOrganizationButton
  }
`)

interface OrganizationFormProps {
  onSubmit: (data: OrganizationInput) => Promise<void>
  onCancel: () => void
  organization?: FragmentType<typeof OrganizationFormFragment>
  hasError: boolean
}

export const OrganizationForm = (props: OrganizationFormProps): JSX.Element => {
  const { onSubmit, onCancel, hasError } = props
  const organization = useFragment(OrganizationFormFragment, props.organization)
  const { register, handleSubmit, formState } = useForm<OrganizationInput>({
    defaultValues: {
      title: organization?.title,
      address: organization?.address,
    },
  })

  const { isSubmitting, errors, isDirty } = formState

  const handleSubmitHelper = (data: OrganizationInput) => {
    return onSubmit({
      ...data,
    })
  }

  const isOrganizationFormReadOnly = !!organization && !organization.canModify
  return (
    <div className="mt-4 flex flex-wrap items-start gap-2">
      <form onSubmit={handleSubmit(handleSubmitHelper)} className="contents" id="organization-form">
        {organization ? (
          <PageHeading>{isOrganizationFormReadOnly ? 'View' : 'Edit'} organization</PageHeading>
        ) : (
          <PageHeading>Create a new organization</PageHeading>
        )}
        <InputField
          label="Name"
          type="text"
          disabled={isSubmitting}
          readOnly={isOrganizationFormReadOnly}
          {...register('title')}
          placeholder="Enter an organization name"
          size={30}
          errorMessage={errors.title?.message}
          isDirty={isDirty}
        />
        <InputField
          label="Address"
          type="text"
          disabled={isSubmitting}
          readOnly={isOrganizationFormReadOnly}
          {...register('address')}
          placeholder="Enter an organization address"
          size={30}
          errorMessage={errors.address?.message}
          isDirty={isDirty}
        />
      </form>
      <div className="mb-8 flex w-full gap-2">
        <button
          className="btn btn-secondary btn-sm"
          disabled={isSubmitting}
          onClick={onCancel}
          title="Cancel the changes"
          type="button"
        >
          Cancel
        </button>
        {organization?.canModify && (
          <ArchiveOrUnarchiveOrganizationButton organization={organization} disabled={isSubmitting} />
        )}
        {!isOrganizationFormReadOnly && (
          <button className="btn btn-primary btn-sm" type="submit" disabled={isSubmitting} form="organization-form">
            {organization ? 'Save' : 'Create'}
          </button>
        )}
        {hasError && <span className="display: inline-block pt-5 text-red-600">Unable to save organization.</span>}
      </div>
    </div>
  )
}
