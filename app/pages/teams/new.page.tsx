import { TeamForm } from '../../frontend/components/teamForm/teamForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'

const NewTeam = (): JSX.Element => {
  return (
    <ProtectedPage>
      <div className="mx-auto max-w-3xl sm:mt-11">
        <h2>Create new team</h2>
        <TeamForm />
      </div>
    </ProtectedPage>
  )
}

export default NewTeam
