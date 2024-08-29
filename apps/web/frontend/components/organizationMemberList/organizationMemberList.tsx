import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { RemoveUserFromOrganizationButton } from './removeUserFromOrganizationButton'
import { RoleButton } from './roleButton'
import { RoleLabel } from './roleLabel'

export const OrganizationMemberListOrganizationFragment = graphql(`
  fragment OrganizationMemberListOrganization on Organization {
    id
    canModify
    ...RemoveUserFromOrganizationButtonOrganization
    members {
      id
      image
      name
      role(organizationId: $organizationId)
      ...RemoveUserFromOrganizationButtonUser
    }
  }
`)

const OrganizationMembershipUpdateMutationDocument = graphql(`
  mutation organizationMembershipUpdate($organizationId: ID!, $userId: ID!, $role: Role!) {
    organizationMembershipCreate(organizationId: $organizationId, userId: $userId, role: $role) {
      id
      # members {
      #   id
      #   role(organizationId: $organizationId)
      # }
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

  const handleUpdateOrganizationMembership = async (userId: string, role: Role) => {
    await updateOrganizationMembership({
      organizationId: organization.id,
      userId,
      role,
    })
  }

  return (
    <table className="table">
      <tbody>
        {organization.members.map((user) => (
          <tr key={user.id}>
            <td className="flex w-full items-center gap-2">
              {user.image ? (
                <div className="avatar">
                  <Image
                    className="rounded-box"
                    width={64}
                    height={64}
                    src={user.image}
                    alt={user.name ?? 'image of the user'}
                  />
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="size-16 rounded-box bg-neutral text-neutral-content" />
                </div>
              )}
              {user.name}
              <RoleLabel role={user.role} />
            </td>
            <td className="w-px">
              {user.id !== session.data?.user.id && organization.canModify && (
                <RoleButton
                  role={user.role}
                  loading={fetching}
                  onUpgrade={() => handleUpdateOrganizationMembership(user.id, Role.Admin)}
                  onDowngrade={() => handleUpdateOrganizationMembership(user.id, Role.Member)}
                />
              )}
            </td>
            <td className="w-px">
              {organization.canModify && session.data?.user.id !== user.id && (
                <RemoveUserFromOrganizationButton user={user} organization={organization} />
                // <div>test</div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
