import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

import { OrganizationForm } from '../../frontend/components/organizationForm/organizationForm'
import { OrganizationMemberList } from '../../frontend/components/organizationMemberList'
import { PageHeading } from '../../frontend/components/pageHeading'
import { ProjectTable } from '../../frontend/components/projectTable'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { graphql } from '../../frontend/generated/gql'
import { OrganizationInput } from '../../frontend/generated/gql/graphql'

const OrganizationQueryDocument = graphql(`
  query organization($organizationId: ID!) {
    organization(organizationId: $organizationId) {
      id
      ...OrganizationForm
      ...OrganizationMemberListOrganization
      projects {
        ...ProjectTableItem
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
  const context = useMemo(() => ({ additionalTypenames: ['User'] }), [])
  const [{ data, fetching }] = useQuery({
    query: OrganizationQueryDocument,
    variables: { organizationId: id?.toString() ?? '' },
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
    return <div>Organization {id} not found</div>
  }

  return (
    <ProtectedPage>
      <OrganizationForm
        organization={selectedOrganization}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        hasError={!!organizationUpdateResult.error}
      />
      <PageHeading>Projects</PageHeading>
      <ProjectTable projects={selectedOrganization.projects} />
      <OrganizationMemberList organization={selectedOrganization} />
    </ProtectedPage>
  )
}

export default OrganizationDetails
