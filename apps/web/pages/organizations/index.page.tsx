import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'urql'

import { OrganizationTable } from '../../frontend/components/organizationTable'
import { PageHeading } from '../../frontend/components/pageHeading'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { graphql } from '../../frontend/generated/gql'

const MyOrganizationsQueryDocument = graphql(`
  query myOrganizations {
    organizations {
      ...OrganizationTableItem
    }
  }
`)

const Organizations = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Organization'] }), [])
  const router = useRouter()

  const [{ data, error, fetching: organizationsLoading }] = useQuery({
    query: MyOrganizationsQueryDocument,
    context,
  })

  const handleAddOrganization = async () => {
    await router.push('/organizations/new')
  }

  return (
    <ProtectedPage>
      <article>
        <PageHeading>Organizations</PageHeading>
        <div className="flex items-center justify-between gap-4">
          <button className="btn btn-primary btn-sm" onClick={handleAddOrganization}>
            New organization
          </button>
        </div>

        {error && <span>{error.message}</span>}
        {organizationsLoading && <span className="loading loading-spinner" />}
        {data &&
          (data.organizations.length === 0 ? (
            <div>No organizations found</div>
          ) : (
            <OrganizationTable organizations={data.organizations} />
          ))}
      </article>
    </ProtectedPage>
  )
}

export default Organizations
