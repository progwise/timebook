import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { RoleButton } from '../roleButton'
import { ProjectRoleLabel } from './projectRoleLabel'
import { RemoveUserFromProjectButton } from './removeUserFromProjectButton'

export const ProjectMemberListProjectFragment = graphql(`
  fragment ProjectMemberListProject on Project {
    id
    canModify
    ...RemoveUserFromProjectButtonProject
    members {
      id
      image
      name
      projectRole(projectId: $projectId)
      ...RemoveUserFromProjectButtonUser
    }
  }
`)

const ProjectMembershipUpdateMutationDocument = graphql(`
  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $projectRole: Role!) {
    projectMembershipCreate(projectId: $projectId, userId: $userId, projectRole: $projectRole) {
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

  const handleUpdateProjectMembership = async (userId: string, projectRole: Role) => {
    await updateProjectMembership({
      projectId: project.id,
      userId,
      projectRole,
    })
  }

  return (
    <table className="table">
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
                  <div className="size-16 rounded-box bg-neutral text-neutral-content" />
                </div>
              )}
              {user.name}
              <ProjectRoleLabel role={user.projectRole} />
            </td>
            <td className="w-px">
              {user.id !== session.data?.user.id && project.canModify && (
                <RoleButton
                  role={user.projectRole}
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
