import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useMutation } from 'urql'

import { Table, TableBody, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { AddProjectMemberForm } from '../addProjectMemberForm'
import { PageHeading } from '../pageHeading'
import { RemoveUserFromProjectButton } from './removeUserFromProjectButton'
import { RoleLabel } from './roleLabel'

const ProjectMemberListProjectFragment = graphql(`
  fragment ProjectMemberListProject on Project {
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
  const [, updateProjectMembership] = useMutation(ProjectMembershipUpdateMutationDocument)

  const handleUpdateProjectMembership = async (userId: string, role: Role) => {
    await updateProjectMembership({
      projectId: project.id,
      userId,
      role,
    })
  }

  return (
    <>
      <PageHeading>Project Members</PageHeading>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <AddProjectMemberForm project={project} />
            </TableCell>
            <TableCell colSpan={2} />
          </TableRow>
          {project.members.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-2">
                {user.image ? (
                  <Image
                    className="rounded-full"
                    width={64}
                    height={64}
                    src={user.image}
                    alt={user.name ?? 'image of the user'}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300" />
                )}
                {user.name}
              </TableCell>
              <TableCell>
                <RoleLabel
                  role={user.role}
                  onUpgrade={() => handleUpdateProjectMembership(user.id, Role.Admin)}
                  onDowngrade={() => handleUpdateProjectMembership(user.id, Role.Member)}
                />
              </TableCell>
              <TableCell>
                {project.canModify && session.data?.user.id !== user.id && (
                  <RemoveUserFromProjectButton user={user} project={project} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
