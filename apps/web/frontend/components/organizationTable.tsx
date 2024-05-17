import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const OrganizationTableItemFragment = graphql(`
  fragment OrganizationTableItem on Organization {
    id
    title
    # members {
    #   id
    #   image
    #   name
    # }
  }
`)

interface OrganizationTableProps {
  organizations: FragmentType<typeof OrganizationTableItemFragment>[]
}

// const MAX_NUMBER_OF_AVATARS = 5

export const OrganizationTable = (props: OrganizationTableProps): JSX.Element => {
  const organizations = useFragment(OrganizationTableItemFragment, props.organizations)

  return (
    <div className="w-full rounded-box border border-base-content/50 shadow-lg">
      <table className="table">
        <thead className="text-lg text-base-content">
          <tr>
            <th>Name</th>
            {/* <th>Members</th> */}
            {/* <th>Duration</th> */}
          </tr>
        </thead>
        <tbody className="text-base">
          {organizations.map((organization) => {
            // const numberOfMembersToBeDisplayed =
            //   MAX_NUMBER_OF_AVATARS === organization.members.length ? MAX_NUMBER_OF_AVATARS : MAX_NUMBER_OF_AVATARS - 1
            return (
              <tr key={organization.id}>
                <td>
                  <Link href={`/organizations/${organization.id}`}>{organization.title}</Link>
                </td>
                {/* <td>
                  <div className="avatar-group -space-x-3">
                    {organization.members.slice(0, numberOfMembersToBeDisplayed).map((member) =>
                      member.image ? (
                        <div key={member.id} className="avatar">
                          <div className="size-9">
                            <Image
                              key={member.id}
                              width={36}
                              height={36}
                              src={member.image}
                              alt={member.name ?? 'image of the user'}
                            />
                          </div>
                        </div>
                      ) : (
                        <div key={member.id} className="avatar placeholder">
                          <div className="size-9 rounded-full bg-neutral text-neutral-content">
                            <span className="text-2xl">{member.name?.at(0)}</span>
                          </div>
                        </div>
                      ),
                    )}
                    {organization.members.length > numberOfMembersToBeDisplayed && (
                      <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-neutral text-neutral-content">
                          <span>+{organization.members.length - numberOfMembersToBeDisplayed}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </td> */}
                {/* <td>
                  {organization.startDate} - {organization.endDate}
                </td> */}
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
