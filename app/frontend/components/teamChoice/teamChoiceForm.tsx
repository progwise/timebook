import React, { useMemo } from 'react'

import { useTeamsWithProjectsQuery } from '../../generated/graphql'
import { TeamTile } from '../teamTile/teamTile'

interface TeamChoiceFormProps {
  includeArchived?: boolean
}

export const TeamChoiceForm = ({ includeArchived }: TeamChoiceFormProps): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Projects'] }), [])
  const [{ data: teamsData }] = useTeamsWithProjectsQuery({ context, variables: { includeArchived } })

  return (
    <div className="flex flex-wrap gap-4 dark:text-white">
      {teamsData?.teams.map((team) => {
        return <TeamTile key={team.id} team={team} />
      })}
    </div>
  )
}
