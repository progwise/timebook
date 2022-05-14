import Link from 'next/link'
import { useMemo } from 'react'

import { useTeamsWithProjectsQuery } from '../../generated/graphql'

export const TeamChoiceForm = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Projects'] }), [])
  const [{ data: teamsData }] = useTeamsWithProjectsQuery({ context })

  return (
    <div className="flex flex-wrap gap-4">
      {teamsData?.team.map((team) => {
        return (
          <article className="rounded-lg border-2 border-solid border-gray-300 py-4 px-6" key={team.id}>
            <h2 className="text-md  mb-2 font-bold text-gray-700">Team &quot;{team.title}&quot;</h2>
            <Link href={`/${team.slug}/team`} passHref={false}>
              <a className="text-blue-600 hover:underline">{`/${team.slug}`}</a>
            </Link>
            {team.projects.length === 0 && <div className="mt-2 flex flex-wrap gap-1 text-xs italic">No projects</div>}
            <div className="mt-2 flex flex-wrap gap-1">
              {team.projects.map((project) => (
                <Link key={project.id} href={`/${team.slug}/projects/${project.id}`} passHref={true}>
                  <a className="text-xs hover:underline">{project.title}</a>
                </Link>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}
