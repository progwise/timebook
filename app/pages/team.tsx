import { Button } from '../frontend/components/button/button'
import { TeamForm } from '../frontend/components/teamForm/teamForm'
import { useUsersQuery } from '../frontend/generated/graphql'

const Team = (): JSX.Element => {
  const [{ data, error }] = useUsersQuery()
  return (
    <>
      <article>
        <h2>Team Details</h2>
        <TeamForm />
      </article>
      <article>
        <h2 className="flexj justify-between">
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
            {data?.users.map((user) => (
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
    </>
  )
}

export default Team
