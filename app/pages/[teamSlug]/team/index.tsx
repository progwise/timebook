import { useRouter } from 'next/router'
import { Button } from '../../../frontend/components/button/button'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { TeamForm } from '../../../frontend/components/teamForm/teamForm'
import { useTeamQuery } from '../../../frontend/generated/graphql'

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
          {teamData?.team && <TeamForm team={teamData.team} />}
        </article>
        <article>
          <h2 className="flex justify-between">
            <span>Members</span>
          </h2>
          <table className="w-full">
            <thead>
              <tr>
                <th />
                <th>Username</th>
                <th>Email</th>
                <th>Projects</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {teamData?.team.members.map((user) => (
                <tr key={user.id}>
                  <td>
                    <img className="w-3" src={user.image ?? undefined} />
                  </td>
                  <td>{user.name}</td>
                  <td>linus@xyz.de</td>
                  <td>Projekt 1, Projekt 2</td>
                  <td>
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
