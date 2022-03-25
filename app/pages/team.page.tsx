import { TeamForm } from '../frontend/components/teamForm/teamForm'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { TeamChoiceForm } from '../frontend/components/teamchoice/teamchoice'

const Team = (): JSX.Element => {
  return (
    <ProtectedPage>
      <div className="timebook">
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
      </div>
    </ProtectedPage>
  )
}

export default Team
