import image from 'next/image'
import { Button } from '../frontend/components/button/button'
import { useUsersQuery } from '../frontend/generated/graphql'

const Team = (): JSX.Element => {
  const [{ data, error }] = useUsersQuery()
  return (
    <article>
      <h2 className="flex justify-between">
        <span>Your Team</span>
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
            <tr key={user.name}>
              <td>
                <img style={{ width: '20px' }} src={user.image} />
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
    </article>
  )
}

export default Team
