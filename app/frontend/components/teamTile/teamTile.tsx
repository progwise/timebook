import Link from 'next/link'
import { TeamWithProjectsFragment } from '../../generated/graphql'

export interface TeamTileProps {
  team: TeamWithProjectsFragment
}
export const TeamTile = ({ team }: TeamTileProps): JSX.Element => {
  return (
    <article
      className="rounded-lg border-2 border-solid border-gray-300 py-4 px-6 hover:backdrop-brightness-105"
      key={team.id}
    >
      <h2 className="text-md mb-2  font-bold text-gray-700 dark:text-white">Team &quot;{team.title}&quot;</h2>
      <Link href={`/${team.slug}/time`} passHref={false}>
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
}
