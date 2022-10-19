import { useRouter } from 'next/router'

import { Button } from '../../frontend/components/button/button'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { TeamChoiceForm } from '../../frontend/components/teamChoice/teamChoiceForm'

const Teams = (): JSX.Element => {
  const router = useRouter()
  const handleAddTeam = () => {
    router.push('/teams/new')
  }
  return (
    <ProtectedPage>
      <Button variant="secondary" onClick={handleAddTeam}>
        Add a new team
      </Button>
      <h2 className="timebook">Your teams</h2>
      <TeamChoiceForm includeArchived />
    </ProtectedPage>
  )
}

export default Teams
