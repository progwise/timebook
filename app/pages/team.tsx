import { Button } from '../frontend/components/button/button'

const Team = (): JSX.Element => {
  return (
    <article>
      <h2 className="flex justify-between">
        <span>Your projects</span>
      </h2>
      <table className="w-full">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Projects</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Linus</td>
            <td>linus@xyz.de</td>
            <td>Projekt 1, Projekt 2</td>
            <td>
              <Button variant="primarySlim">Details</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  )
}

export default Team
