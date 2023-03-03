import { Table, TableBody, TableCell, TableRow } from '@progwise/timebook-ui'
import Image from 'next/image'
import { SimpleUserFragment } from '../generated/graphql'

interface ProjectMemberListProps {
  users: SimpleUserFragment[]
}

export const ProjectMemberList = ({ users }: ProjectMemberListProps) => (
  <>
    <h2 className="text-lg font-semibold text-gray-400">Project Members</h2>
    <Table>
      <TableBody>
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
      </TableBody>
    </Table>
  </>
)
