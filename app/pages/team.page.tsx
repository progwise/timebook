import { TeamForm } from '../frontend/components/teamForm/teamForm'
import { ProtectedPage } from '../frontend/components/protectedPage'

const Team = (): JSX.Element => {
  return (
    <ProtectedPage>
      <article>
        <h2>Create new team</h2>
        <TeamForm />
      </article>
    </ProtectedPage>
  )
}

export default Team
