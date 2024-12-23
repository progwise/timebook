import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

import { OrganizationForm } from '../../../frontend/components/organizationForm/organizationForm'
import { OrganizationMemberList } from '../../../frontend/components/organizationMemberList'
import { ProjectTable } from '../../../frontend/components/projectTable'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { graphql } from '../../../frontend/generated/gql'
import { OrganizationInput } from '../../../frontend/generated/gql/graphql'
import { InvoiceTable } from './components/invoiceTable'
import { SubscriptionStatusOrganizationLink } from './components/subscriptionStatusOrganizationLink/subscriptionStatusOrganizationLink'

const OrganizationQueryDocument = graphql(`
  query organization($organizationId: ID!) {
    organization(organizationId: $organizationId) {
      id
      canModify
      ...OrganizationForm
      ...OrganizationMemberListOrganization
      projects {
        ...ProjectTableItem
      }
      invoices {
        ...Invoice
      }
    }
  }
`)

const OrganizationUpdateMutationDocument = graphql(`
  mutation organizationUpdate($id: ID!, $data: OrganizationInput!) {
    organizationUpdate(id: $id, data: $data) {
      id
    }
  }
`)

const OrganizationDetails = (): JSX.Element => {
  const router = useRouter()
  const { organizationId } = router.query
  const context = useMemo(() => ({ additionalTypenames: ['User', 'Project'] }), [])
  const [{ data, fetching }] = useQuery({
    query: OrganizationQueryDocument,
    variables: { organizationId: organizationId?.toString() ?? '' },
    context,
    pause: !router.isReady,
  })

  const selectedOrganization = data?.organization
  const [organizationUpdateResult, organizationUpdate] = useMutation(OrganizationUpdateMutationDocument)

  const handleSubmit = async (data: OrganizationInput) => {
    try {
      if (!selectedOrganization?.id) {
        throw new Error('organization id missing')
      }
      const result = await organizationUpdate({ id: selectedOrganization.id, data })
      if (result.error) {
        throw new Error('graphql error')
      }
      await router.push('/organizations')
    } catch {}
  }

  const handleCancel = async () => {
    await router.push('/organizations')
  }

  if (!router.isReady || fetching) {
    return <div>Loading...</div>
  }

  if (!selectedOrganization) {
    return <div>Organization {organizationId} not found</div>
  }

  return (
    <ProtectedPage>
      <SubscriptionStatusOrganizationLink />
      <OrganizationForm
        organization={selectedOrganization}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        hasError={!!organizationUpdateResult.error}
      />
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <input type="radio" name="tab" role="tab" className="tab" aria-label="Projects" defaultChecked />
        <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
          {selectedOrganization.projects.length > 0 ? (
            <ProjectTable projects={selectedOrganization.projects} />
          ) : (
            <div>There are currently no projects in this organization</div>
          )}
        </div>
        <input type="radio" name="tab" role="tab" className="tab" aria-label="Members" />
        <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
          <OrganizationMemberList organization={selectedOrganization} />
        </div>
        {selectedOrganization.canModify && (
          <>
            <input type="radio" name="tab" role="tab" className="tab" aria-label="Invoices" />
            <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
              {selectedOrganization.invoices.length > 0 ? (
                <InvoiceTable invoices={selectedOrganization.invoices} organizationId={selectedOrganization.id} />
              ) : (
                <div>
                  There are currently no invoices in this organization, click{' '}
                  <Link
                    href={`/organizations/${router.query.organizationId}/invoices/new`}
                    className="link link-primary"
                  >
                    here
                  </Link>{' '}
                  to create one.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedPage>
  )
}

export default OrganizationDetails
