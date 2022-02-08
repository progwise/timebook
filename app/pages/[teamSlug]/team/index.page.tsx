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
        <article className="timebook">
          <h2>Team Details</h2>
          {teamData?.team && <TeamForm key={teamData.team.id} team={teamData.team} />}
        </article>
        <article className="timebook">
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
                    <img className="w-3" src={user.image ?? undefined} />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.projects.map((project) => project.title).join(', ')}</td>
                  <td className="text-right">
                    <Button ariaLabel="Details" variant="primarySlim">Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button ariaLabel="Add team member" variant="primary">
            Add Team Member
          </Button>
        </article>
      </ProtectedPage>
    </>
  )
}

export default Team
