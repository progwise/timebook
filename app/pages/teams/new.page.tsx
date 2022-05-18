import { TeamForm } from '../../frontend/components/teamForm/teamForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'

const NewTeam = (): JSX.Element => {
  return (
    <ProtectedPage>
      <article className="timebook">
        <h2>Create new team</h2>
        <TeamForm />
      </article>
      <br />
    </ProtectedPage>
  )
}

export default NewTeam
