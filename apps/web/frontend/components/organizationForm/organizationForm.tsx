import { useForm } from 'react-hook-form'

import { InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { OrganizationInput } from '../../generated/gql/graphql'
import { PageHeading } from '../pageHeading'
import { ArchiveOrUnarchiveOrganizationButton } from './archiveOrUnarchiveOrganizationButton/archiveOrUnarchiveOrganizationButton'
import { OrganizationSubscriptionStatusLabel } from './organizationSubscriptionStatusLabel'
import { SubscribeOrUnsubscribeOrganizationButton } from './subscribeOrUnsubscribeOrganizationButton/subscribeOrUnsubscribeOrganizationButton'

export const OrganizationFormFragment = graphql(`
  fragment OrganizationForm on Organization {
    title
    address
    canModify
    subscriptionStatus
    ...ArchiveOrUnarchiveOrganizationButton
    ...SubscribeOrUnsubscribeOrganizationButton
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
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit(handleSubmitHelper)} className="contents" id="organization-form">
        {organization ? (
          <PageHeading>
            Organization {organization.title}{' '}
            <OrganizationSubscriptionStatusLabel subscriptionStatus={organization.subscriptionStatus ?? undefined} />
          </PageHeading>
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
      <div className="flex flex-row gap-2">
        <button className="btn btn-secondary btn-sm" disabled={isSubmitting} onClick={onCancel} type="button">
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
        <div className="w-full text-right">
          {organization?.canModify && (
            <SubscribeOrUnsubscribeOrganizationButton organization={organization} disabled={isSubmitting} />
          )}
        </div>
      </div>
    </div>
  )
}
