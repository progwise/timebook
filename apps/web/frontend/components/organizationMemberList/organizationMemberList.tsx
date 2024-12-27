import { useSession } from 'next-auth/react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { RoleButton } from '../roleButton'
import { RoleLabel } from '../roleLabel'
import { UserLabel } from '../userLabel'
import { RemoveUserFromOrganizationButton } from './removeUserFromOrganizationButton'

export const OrganizationMemberListOrganizationFragment = graphql(`
  fragment OrganizationMemberListOrganization on Organization {
    id
    canModify
    ...RemoveUserFromOrganizationButtonOrganization
    members {
      id
      image
      name
      organizationRole(organizationId: $organizationId)
      ...RemoveUserFromOrganizationButtonUser
    }
  }
`)

const OrganizationMembershipUpdateMutationDocument = graphql(`
  mutation organizationMembershipUpdate($organizationId: ID!, $userId: ID!, $organizationRole: Role!) {
    organizationMembershipCreate(
      organizationId: $organizationId
      userId: $userId
      organizationRole: $organizationRole
    ) {
      id
    }
  }
`)

interface OrganizationMemberListProps {
  organization: FragmentType<typeof OrganizationMemberListOrganizationFragment>
}

export const OrganizationMemberList = (props: OrganizationMemberListProps) => {
  const organization = useFragment(OrganizationMemberListOrganizationFragment, props.organization)
  const session = useSession()
  const [{ fetching }, updateOrganizationMembership] = useMutation(OrganizationMembershipUpdateMutationDocument)

  const handleUpdateOrganizationMembership = async (userId: string, organizationRole: Role) => {
    await updateOrganizationMembership({
      organizationId: organization.id,
      userId,
      organizationRole,
    })
  }

  return (
    <table className="table">
      <tbody>
        {organization.members.map((user) => (
          <tr key={user.id}>
            <td className="flex w-full items-center gap-2">
              <div className="min-w-52">
                <UserLabel name={user.name ?? user.id} image={user.image ?? undefined} imageSize={28} />
              </div>
              <RoleLabel role={user.organizationRole} context="Organization" />
            </td>
            <td className="w-px">
              {user.id !== session.data?.user.id && organization.canModify && (
                <RoleButton
                  role={user.organizationRole}
                  loading={fetching}
                  onUpgrade={() => handleUpdateOrganizationMembership(user.id, Role.Admin)}
                  onDowngrade={() => handleUpdateOrganizationMembership(user.id, Role.Member)}
                />
              )}
            </td>
            <td className="w-px">
              {session.data?.user.id !== user.id && organization.canModify && (
                <RemoveUserFromOrganizationButton user={user} organization={organization} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
