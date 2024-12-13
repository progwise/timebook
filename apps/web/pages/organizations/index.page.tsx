import Link from 'next/link'
import { useMemo, useState } from 'react'
import { FaFolderMinus, FaFolderOpen, FaFolderTree } from 'react-icons/fa6'
import { useQuery } from 'urql'

import { Listbox } from '@progwise/timebook-ui'

import { OrganizationTable } from '../../frontend/components/organizationTable'
import { PageHeading } from '../../frontend/components/pageHeading'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { graphql } from '../../frontend/generated/gql'
import { OrganizationFilter } from '../../frontend/generated/gql/graphql'

const MyOrganizationsQueryDocument = graphql(`
  query myOrganizations($filter: OrganizationFilter) {
    organizations(filter: $filter) {
      ...OrganizationTableItem
    }
  }
`)

const organizationCountsQueryDocument = graphql(`
  query organizationCounts {
    allCounts: organizationsCount(filter: ALL)
    activeCounts: organizationsCount(filter: ACTIVE)
    archivedCounts: organizationsCount(filter: ARCHIVED)
  }
`)

const Organizations = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Organization'] }), [])
  const [selectedOrganizationFilter, setSelectedOrganizationFilter] = useState<OrganizationFilter>(
    OrganizationFilter.Active,
  )

  const [{ data, error, fetching: organizationsLoading }] = useQuery({
    query: MyOrganizationsQueryDocument,
    context,
    variables: { filter: selectedOrganizationFilter },
  })
  const [{ data: organizationCountsData }] = useQuery({
    query: organizationCountsQueryDocument,
    context,
  })

  const organizationFilterKeyToLabel: Record<OrganizationFilter, string | JSX.Element> = {
    ALL: (
      <>
        <FaFolderTree className="inline" /> all organizations{' '}
        {organizationCountsData ? `(${organizationCountsData.allCounts})` : ''}
      </>
    ),
    ACTIVE: (
      <>
        <FaFolderOpen className="inline" /> current organizations{' '}
        {organizationCountsData ? `(${organizationCountsData.activeCounts})` : ''}
      </>
    ),
    ARCHIVED: (
      <>
        <FaFolderMinus className="inline" /> archived organizations{' '}
        {organizationCountsData ? `(${organizationCountsData.archivedCounts})` : ''}
      </>
    ),
  }

  return (
    <ProtectedPage>
      <PageHeading>Organizations</PageHeading>
      <div className="flex items-center justify-between">
        <Link className="btn btn-primary btn-sm" href="/organizations/new">
          New organization
        </Link>
        <Listbox
          value={selectedOrganizationFilter}
          getLabel={(organizationFilter) => organizationFilterKeyToLabel[organizationFilter]}
          getKey={(organizationFilter) => organizationFilter}
          onChange={(organizationFilter) => setSelectedOrganizationFilter(organizationFilter)}
          options={Object.values(OrganizationFilter)}
        />
      </div>

      {error && <span>{error.message}</span>}
      {organizationsLoading && <span className="loading loading-spinner" />}
      {data &&
        (data.organizations.length === 0 ? (
          <div>No organizations found</div>
        ) : (
          <OrganizationTable organizations={data.organizations} />
        ))}
    </ProtectedPage>
  )
}

export default Organizations
