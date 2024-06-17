import Link from 'next/link'
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

  const [{ data, error, fetching: organizationsLoading }] = useQuery({
    query: MyOrganizationsQueryDocument,
    context,
  })

  return (
    <ProtectedPage>
      <article>
        <PageHeading>Organizations</PageHeading>
        <div className="flex items-center justify-between py-2">
          <Link className="btn btn-primary btn-sm" href="/organizations/new">
            New organization
          </Link>
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
