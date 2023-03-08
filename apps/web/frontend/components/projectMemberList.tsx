import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '@progwise/timebook-ui'
import Image from 'next/image'
import { SimpleUserFragment } from '../generated/graphql'
import { AddProjectMember } from './addProjectMember'

interface ProjectMemberListProps {
  users: SimpleUserFragment[]
}

export const ProjectMemberList = ({ users }: ProjectMemberListProps) => (
  <>
    <h2 className="text-lg font-semibold text-gray-400">Project Members</h2>
    <Table>
      <TableHead>
        <TableHeadRow>
          <TableHeadCell className="w-2/3 border-none p-0" />
          <TableHeadCell className="w-1/3 border-none p-0" />
        </TableHeadRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>
            <AddProjectMember />
          </TableCell>
          <TableCell className="relative">
            <Button
              className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2"
              variant="secondary"
              onClick={console.log}
              tooltip="Copies a link with which member can join the project"
            >
              Invitation link
            </Button>
          </TableCell>
        </TableRow>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-2">
              {user.image ? (
                <Image className="rounded-full" width={64} height={64} src={user.image} />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-300" />
              )}
              {user.name}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <AddProjectMember />
        </TableRow>
      </TableBody>
    </Table>
  </>
)
