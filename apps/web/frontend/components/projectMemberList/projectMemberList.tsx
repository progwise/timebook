import { useSession } from 'next-auth/react'
import Image from 'next/image'

import { Table, TableBody, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { AddProjectMemberForm } from '../addProjectMemberForm'
import { RemoveUserFromProjectButton } from './removeUserFromProjectButton'
import { RoleLabel } from './roleLabel'

const ProjectMemberListProjectFragment = graphql(`
  fragment ProjectMemberListProject on Project {
    id
    canModify
    ...RemoveUserFromProjectButtonProject
    members {
      id
      image
      name
      role(projectId: $projectId)
      ...RemoveUserFromProjectButtonUser
    }
  }
`)

interface ProjectMemberListProps {
  project: FragmentType<typeof ProjectMemberListProjectFragment>
}

export const ProjectMemberList = (props: ProjectMemberListProps) => {
  const project = useFragment(ProjectMemberListProjectFragment, props.project)
  const session = useSession()

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-400">Project Members</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <AddProjectMemberForm projectId={project.id} />
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
                <RoleLabel role={user.role} />
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
