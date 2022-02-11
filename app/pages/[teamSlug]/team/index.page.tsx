import { useRouter } from 'next/router'
import { Button } from '../../../frontend/components/button/button'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { TeamForm } from '../../../frontend/components/teamForm/teamForm'
import { useTeamQuery } from '../../../frontend/generated/graphql'
import Image from 'next/image'

const Team = (): JSX.Element => {
  const router = useRouter()
  const [{ data: teamData }] = useTeamQuery({ pause: !router.isReady })
  if (!router.isReady) {
    return <div>Loading...</div>
  }

  return (
    <>
      <ProtectedPage>
        <article>
          <h2>Team Details</h2>
          {teamData?.team && <TeamForm key={teamData.team.id} team={teamData.team} />}
        </article>
        <article>
          <h2 className="flex justify-between">
            <span>Members</span>
          </h2>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th />
                <th className="text-left">Username</th>
                <th className="text-left">Projects</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {teamData?.team.members.map((user) => (
                <tr key={user.id}>
                  <td>
                    {user.image ? (
                      <Image width={12} height={12} src={user.image} alt={user.name ?? 'Profile picture'} />
                    ) : undefined}
                  </td>
                  <td>{user.name}</td>
                  <td>{user.projects.map((project) => project.title).join(', ')}</td>
                  <td className="text-right">
                    <Button variant="primarySlim">Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="primary">Add Team Member</Button>
        </article>
      </ProtectedPage>
    </>
  )
}

export default Team
