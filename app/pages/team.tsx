import { useRouter } from 'next/router'
import { Button } from '../frontend/components/button/button'
import { TeamForm } from '../frontend/components/teamForm/teamForm'
import { useTeamQuery, useUsersQuery } from '../frontend/generated/graphql'

const Team = (): JSX.Element => {
  return (
    <article>
      <h2>Create new team</h2>
      <TeamForm />
    </article>
  )
}

export default Team
