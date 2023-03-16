import Image from 'next/image'

import { Table, TableBody, TableCell, TableRow } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../generated/gql'
import { Role } from '../generated/gql/graphql'
import { AddProjectMember } from './addProjectMember'

const ProjectMemberListUserFragment = graphql(`
  fragment ProjectMemberListUser on User {
    id
    image
    name
    role(projectId: $projectId)
  }
`)

interface ProjectMemberListProps {
  users: FragmentType<typeof ProjectMemberListUserFragment>[]
  projectId: string
}

export const ProjectMemberList = (props: ProjectMemberListProps) => {
  const users = useFragment(ProjectMemberListUserFragment, props.users)
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-400">Project Members</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="flex items-center gap-2">
              <AddProjectMember projectId={props.projectId} />
            </TableCell>
          </TableRow>
          {users.map((user) => (
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
              <TableCell>{user.role === Role.Admin && 'Admin'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
