import { useMemo } from 'react'

import { Spinner } from '@progwise/timebook-ui'

import { useTeamsQuery } from '../../generated/graphql'
import { TeamTile } from '../teamTile/teamTile'

interface TeamChoiceFormProps {
  includeArchived?: boolean
}

export const TeamChoiceForm = ({ includeArchived }: TeamChoiceFormProps): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Team'] }), [])
  const [{ data: teamsData, fetching }] = useTeamsQuery({ context, variables: { includeArchived } })

  if (fetching) return <Spinner />

  return (
    <div className="flex flex-wrap gap-4 dark:text-white">
      {teamsData?.teams.map((team) => {
        return <TeamTile key={team.id} team={team} />
      })}
    </div>
  )
}
