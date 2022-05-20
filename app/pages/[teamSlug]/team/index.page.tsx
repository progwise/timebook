/* eslint-disable unicorn/no-useless-undefined */
import { useRouter } from 'next/router'
import { Button } from '../../../frontend/components/button/button'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { TeamForm } from '../../../frontend/components/teamForm/teamForm'
import { useTeamQuery } from '../../../frontend/generated/graphql'
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

const Team = (): JSX.Element => {
  const router = useRouter()
  const slug = router.query.teamSlug?.toString() ?? ''
  const handleUserDetails = async (userId: string) => {
    await router.push(`/${slug}/team/${userId}`)
  }

  const [{ data: teamData }] = useTeamQuery({ pause: !router.isReady })
  if (!router.isReady) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ProtectedPage>
        <section>
          <h2>Team Details</h2>
          {teamData?.team && <TeamForm key={teamData.team.id} team={teamData.team} />}
        </section>
        <section>
          <h2 className="flex justify-between">
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
          <Button variant="secondary">Invite Member</Button>
        </section>
        <section>
          <h2>Customers</h2>
          <CustomerTable />
        </section>
      </ProtectedPage>
    </>
  )
}

export default Team
