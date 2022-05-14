import Link from 'next/link'
import { useRouter } from 'next/router'

import { useTeamsQuery } from '../../generated/graphql'

export const TeamChoiceForm = (): JSX.Element => {
  const [{ data: teamsData }] = useTeamsQuery()

  return (
    <div className="flex gap-2">
      {teamsData?.teams.map((team) => {
        return (
          <article className="border-2 border-solid rounded-lg border-blue-500 p-4" key={team.id}>
            <h2 className="text-md  font-bold text-gray-700 mb-2">Team &quot;{team.title}&quot;</h2>
            <Link href={`/${team.slug}/team`} passHref={false}>
              {`/${team.slug}`}
            </Link>
          </article>
        )
      })}
    </div>
  )
}
