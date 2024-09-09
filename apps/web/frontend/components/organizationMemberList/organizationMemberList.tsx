import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { AddUserToOrganizationButton } from './addUserToOrganizationButton'
import { RemoveUserFromOrganizationButton } from './removeUserFromOrganizationButton'
import { RoleButton } from './roleButton'
import { RoleLabel } from './roleLabel'

export const OrganizationMemberListOrganizationFragment = graphql(`
  fragment OrganizationMemberListOrganization on Organization {
    id
    canModify
    ...RemoveUserFromOrganizationButtonOrganization
    ...AddUserToOrganizationButtonOrganization
    members {
      id
      image
      name
      role(organizationId: $organizationId)
      ...RemoveUserFromOrganizationButtonUser
      ...AddUserToOrganizationButtonUser
    }
  }
`)

export const OrganizationProjectMemberListProjectFragment = graphql(`
  fragment OrganizationProjectMemberListProject on Project {
    id
    canModify
    ...RemoveUserFromProjectButtonProject
    members {
      id
      image
      name
      role
      ...AddUserToOrganizationButtonUser
      ...RemoveUserFromProjectButtonUser
      ...RemoveUserFromOrganizationButtonUser
    }
  }
`)

const OrganizationMembershipUpdateMutationDocument = graphql(`
  mutation organizationMembershipUpdate($organizationId: ID!, $userId: ID!, $role: Role!) {
    organizationMembershipCreate(organizationId: $organizationId, userId: $userId, role: $role) {
      id
    }
  }
`)

interface OrganizationMemberListProps {
  organization: FragmentType<typeof OrganizationMemberListOrganizationFragment>
  projects: FragmentType<typeof OrganizationProjectMemberListProjectFragment>[]
}

export const OrganizationMemberList = (props: OrganizationMemberListProps) => {
  const projects = useFragment(OrganizationProjectMemberListProjectFragment, props.projects)
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

  const organizationMemberIds = new Set(organization.members.map((user) => user.id))

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
              <RoleLabel role={user.role} isOrganizationMember={true} />
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
              {session.data?.user.id !== user.id &&
                (organization.canModify ? (
                  <RemoveUserFromOrganizationButton user={user} organization={organization} />
                ) : (
                  <AddUserToOrganizationButton user={user} organization={organization} />
                ))}
            </td>
          </tr>
        ))}
        {projects.map((project) =>
          project.members
            .filter((user) => !organizationMemberIds.has(user.id))
            .map((user) => (
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
                  <RoleLabel role={user.role} isOrganizationMember={false} />
                </td>
                <td className="w-px">
                  {user.id !== session.data?.user.id &&
                    organization.canModify &&
                    organizationMemberIds.has(user.id) && (
                      <RoleButton
                        role={user.role}
                        loading={fetching}
                        onUpgrade={() => handleUpdateOrganizationMembership(user.id, Role.Admin)}
                        onDowngrade={() => handleUpdateOrganizationMembership(user.id, Role.Member)}
                      />
                    )}
                </td>
                <td className="w-px">
                  {session.data?.user.id !== user.id &&
                    (organizationMemberIds.has(user.id) ? (
                      <RemoveUserFromOrganizationButton user={user} organization={organization} />
                    ) : (
                      <AddUserToOrganizationButton user={user} organization={organization} />
                    ))}
                </td>
              </tr>
            )),
        )}
      </tbody>
    </table>
  )
}
