import React, { useMemo } from 'react'
import { useTeamsWithProjectsQuery } from '../../generated/graphql'
import { TeamTile } from '../teamTile/teamTile'

export const TeamChoiceForm = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Projects'] }), [])
  const [{ data: teamsData }] = useTeamsWithProjectsQuery({ context })

  return (
    <div className="flex flex-wrap gap-4">
      {teamsData?.teams.map((team) => {
        return (
          <React.Fragment key={team.id}>
            <TeamTile team={{ ...team }} />
          </React.Fragment>
        )
      })}
    </div>
  )
}
