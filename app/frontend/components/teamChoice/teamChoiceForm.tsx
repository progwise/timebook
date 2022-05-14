import Link from 'next/link'
import { useMemo } from 'react'

import { useTeamsQuery } from '../../generated/graphql'

export const TeamChoiceForm = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Projects'] }), [])
  const [{ data: teamsData }] = useTeamsQuery({ context })

  return (
    <div className="flex gap-4 flex-wrap">
      {teamsData?.teams.map((team) => {
        return (
          <article className="border-2 border-solid rounded-lg border-gray-300 py-4 px-6" key={team.id}>
            <h2 className="text-md  font-bold text-gray-700 mb-2">Team &quot;{team.title}&quot;</h2>
            <Link href={`/${team.slug}/team`} passHref={false}>
              <a className="text-blue-600 hover:underline">{`/${team.slug}`}</a>
            </Link>
            { team.projects.length === 0 && (
              <div className="flex flex-wrap gap-1 mt-2 text-xs italic">No projects</div>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {team.projects.map((project) => (
                <Link key={project.id} href={`/${team.slug}/projects/${project.id}`} passHref={true}>
                  <a className="hover:underline text-xs">{project.title}</a>
                </Link>)
              )}
            </div>
          </article>
        )
      })}
    </div>
  )
}
