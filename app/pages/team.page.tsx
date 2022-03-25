import { TeamForm } from '../frontend/components/teamForm/teamForm'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { TeamChoiceForm } from '../frontend/components/teamChoice/teamChoice'

const Team = (): JSX.Element => {
  return (
    <ProtectedPage>
      <article className="timebook">
        <h2>Create new team</h2>
        <TeamForm />
      </article>
      <br />

      <article className="timebook">
        <h2 className="timebook">Choose an existing team</h2>
        <br />
        <TeamChoiceForm />
      </article>
    </ProtectedPage>
  )
}

export default Team
