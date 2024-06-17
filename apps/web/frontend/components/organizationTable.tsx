import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const OrganizationTableItemFragment = graphql(`
  fragment OrganizationTableItem on Organization {
    id
    title
  }
`)

interface OrganizationTableProps {
  organizations: FragmentType<typeof OrganizationTableItemFragment>[]
}

export const OrganizationTable = (props: OrganizationTableProps): JSX.Element => {
  const organizations = useFragment(OrganizationTableItemFragment, props.organizations)

  return (
    <div className="w-full rounded-box border border-base-content/50 shadow-lg">
      <table className="table">
        <thead className="text-lg text-base-content">
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody className="text-base">
          {organizations.map((organization) => {
            return (
              <tr key={organization.id}>
                <td>
                  <Link href={`/organizations/${organization.id}`}>{organization.title}</Link>
                </td>
                <td className="text-right">
                  <Link className="btn btn-outline btn-secondary btn-sm" href={`/organizations/${organization.id}`}>
                    Details
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
