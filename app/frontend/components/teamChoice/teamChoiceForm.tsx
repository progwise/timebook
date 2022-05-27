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
            <TeamTile
              team={{
                id: team.id,
                title: team.title,
                slug: team.slug,
                inviteKey: team.inviteKey,
                projects: team.projects,
                theme: team.theme,
              }}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}
