import { TeamForm } from '../../frontend/components/teamForm/teamForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'

const NewTeam = (): JSX.Element => {
  return (
    <ProtectedPage>
      <h2>Create new team</h2>
      <TeamForm />
    </ProtectedPage>
  )
}

export default NewTeam
