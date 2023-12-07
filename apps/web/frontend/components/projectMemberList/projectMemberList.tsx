import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { AddProjectMemberForm } from '../addProjectMemberForm'
import { InviteLink } from '../inviteLink'
import { RemoveUserFromProjectButton } from './removeUserFromProjectButton'
import { RoleButton } from './roleButton'
import { RoleLabel } from './roleLabel'

export const ProjectMemberListProjectFragment = graphql(`
  fragment ProjectMemberListProject on Project {
    id
    canModify
    ...RemoveUserFromProjectButtonProject
    ...AddProjectMemberForm
    members {
      id
      image
      name
      role(projectId: $projectId)
      ...RemoveUserFromProjectButtonUser
    }
    ...InviteLinkProjectFragment
  }
`)

const ProjectMembershipUpdateMutationDocument = graphql(`
  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $role: Role!) {
    projectMembershipCreate(projectId: $projectId, userId: $userId, role: $role) {
      id
    }
  }
`)

interface ProjectMemberListProps {
  project: FragmentType<typeof ProjectMemberListProjectFragment>
}

export const ProjectMemberList = (props: ProjectMemberListProps) => {
  const project = useFragment(ProjectMemberListProjectFragment, props.project)
  const session = useSession()
  const [{ fetching }, updateProjectMembership] = useMutation(ProjectMembershipUpdateMutationDocument)

  const handleUpdateProjectMembership = async (userId: string, role: Role) => {
    await updateProjectMembership({
      projectId: project.id,
      userId,
      role,
    })
  }

  return (
    <table className="table mt-10">
      <thead>
        <tr className="border-none">
          <th className="text-xl font-normal text-base-content">Project Members</th>
        </tr>
        <tr className="border-none">
          <th colSpan={3} className="px-1 font-normal text-base-content">
            <InviteLink project={project} />
          </th>
        </tr>
        <tr className="border-b border-base-content">
          <th colSpan={3} className="px-1 font-normal">
            <AddProjectMemberForm project={project} />
          </th>
        </tr>
      </thead>
      <tbody>
        {project.members.map((user) => (
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
                  <div className="rounded-box h-16 w-16 bg-neutral text-neutral-content" />
                </div>
              )}
              {user.name}
              <RoleLabel role={user.role} />
            </td>
            <td className="w-px">
              {user.id !== session.data?.user.id && project.canModify && (
                <RoleButton
                  role={user.role}
                  loading={fetching}
                  onUpgrade={() => handleUpdateProjectMembership(user.id, Role.Admin)}
                  onDowngrade={() => handleUpdateProjectMembership(user.id, Role.Member)}
                />
              )}
            </td>
            <td className="w-px">
              {project.canModify && session.data?.user.id !== user.id && (
                <RemoveUserFromProjectButton user={user} project={project} />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
