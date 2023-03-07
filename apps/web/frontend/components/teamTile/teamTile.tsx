import Link from 'next/link'

import { TeamFragment } from '../../generated/graphql'

export interface TeamTileProps {
  team: TeamFragment
}
export const TeamTile = ({ team }: TeamTileProps): JSX.Element => {
  return (
    <article
      className={`rounded-lg border-2 border-solid border-gray-300 py-4 px-6 ${
        team.archived ? 'opacity-50' : ''
      } hover:backdrop-brightness-105`}
      key={team.id}
    >
      <h2 className="mb-2 font-bold text-gray-700 dark:text-white">Team &quot;{team.title}&quot;</h2>
      <Link href={`/${team.slug}/time`} passHref={false}>
        <a className="text-blue-600 hover:underline">{`/${team.slug}`}</a>
      </Link>
    </article>
  )
}
