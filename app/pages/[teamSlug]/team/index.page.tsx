/* eslint-disable unicorn/no-useless-undefined */
import { useRouter } from 'next/router'
import { Button } from '../../../frontend/components/button/button'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { TeamForm } from '../../../frontend/components/teamForm/teamForm'
import { TeamFragment, useTeamQuery } from '../../../frontend/generated/graphql'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '../../../frontend/components/table/table'
import { CustomerTable } from '../../../frontend/components/customerForm/customerTable'
import { TeamArchiveModal } from '../../../frontend/components/teamArchiveModal'
import { useState } from 'react'

const Team = (): JSX.Element => {
  const router = useRouter()
  const [{ data: teamData, fetching }] = useTeamQuery({ pause: !router.isReady })
  const [teamToBeArchived, setTeamToBeArchived] = useState<TeamFragment | undefined>()

  const slug = router.query.teamSlug?.toString() ?? ''

  const handleUserDetails = async (userId: string) => {
    await router.push(`/${slug}/team/${userId}`)
  }

  if (!router.isReady || fetching) {
    return <div>Loading...</div>
  }

  if (!teamData?.team) {
    return <div>Team not found</div>
  }

  return (
    <>
      <ProtectedPage>
        <section>
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-medium text-gray-500">Team Details</h2>
            {teamData.team.canModify && (
              <Button variant="secondary" onClick={() => setTeamToBeArchived(teamData.team)}>
                Archive
              </Button>
            )}
          </div>
          <TeamForm key={teamData.team.id} team={teamData.team} />
        </section>
        <section>
          <h2 className="text-xl font-medium text-gray-500">
            <span>Members</span>
          </h2>
          <Table className="w-full table-auto">
            <TableHeadRow>
              <TableHeadCell className="text-left">Username</TableHeadCell>
              <TableHeadCell className="text-left">Projects</TableHeadCell>
              <TableHeadCell />
            </TableHeadRow>
            <TableBody>
              {teamData?.team.members.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {user.image ? (
                      <Image width={12} height={12} src={user.image} alt={user.name ?? 'Profile picture'} />
                    ) : undefined}
                    {user.name}
                  </TableCell>
                  <TableCell>{user.projects.map((project) => project.title).join(', ')}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => handleUserDetails(user.id)} variant="tertiary">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        <section>
          <h2 className="text-xl font-medium text-gray-500">Customers</h2>
          <CustomerTable />
        </section>
        {teamToBeArchived ? (
          // eslint-disable-next-line unicorn/no-useless-undefined
          <TeamArchiveModal open onClose={() => setTeamToBeArchived(undefined)} team={teamToBeArchived} />
        ) : undefined}
      </ProtectedPage>
    </>
  )
}

export default Team
