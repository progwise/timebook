import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

import { OrganizationForm } from '../../../frontend/components/organizationForm/organizationForm'
import { OrganizationMemberList } from '../../../frontend/components/organizationMemberList'
import { ProjectTable } from '../../../frontend/components/projectTable'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { graphql } from '../../../frontend/generated/gql'
import { OrganizationInput } from '../../../frontend/generated/gql/graphql'
import { InvoiceTable } from './invoiceTable'
import { SubscriptionStatusOrganizationLink } from './subscriptionStatusOrganizationLink/subscriptionStatusOrganizationLink'

const OrganizationQueryDocument = graphql(`
  query organization($organizationId: ID!) {
    organization(organizationId: $organizationId) {
      id
      members {
        id
        organizationRole(organizationId: $organizationId)
      }
      ...OrganizationForm
      ...OrganizationMemberListOrganization
      projects {
        ...ProjectTableItem
      }
      invoices {
        id
        ...InvoiceTableItem
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
  const { id } = router.query
  const context = useMemo(() => ({ additionalTypenames: ['User', 'Project'] }), [])
  const [{ data, fetching }] = useQuery({
    query: OrganizationQueryDocument,
    variables: { organizationId: id?.toString() ?? '' },
    context,
    pause: !router.isReady,
  })

  const selectedOrganization = data?.organization
  const [organizationUpdateResult, organizationUpdate] = useMutation(OrganizationUpdateMutationDocument)

  const session = useSession()

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
    return <div>Organization {id} not found</div>
  }

  const isAdmin = selectedOrganization.members.some(
    (member) => member.id === session.data?.user.id && member.organizationRole === 'ADMIN',
  )

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
            <div>There is currently no projects in this organization</div>
          )}
        </div>
        <input type="radio" name="tab" role="tab" className="tab" aria-label="Members" />
        <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
          <OrganizationMemberList organization={selectedOrganization} />
        </div>
        {isAdmin && (
          <>
            <input type="radio" name="tab" role="tab" className="tab" aria-label="Invoices" />
            <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
              {selectedOrganization.invoices.length > 0 ? (
                <InvoiceTable invoices={selectedOrganization.invoices} />
              ) : (
                <div>There is currently no invoices in this organization</div>
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedPage>
  )
}

export default OrganizationDetails
