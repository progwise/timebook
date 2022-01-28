import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useTeamsQuery } from '../../generated/graphql'
import { TopNavigationLink } from './topNavigationLink'

export const TopNavigation = (): JSX.Element => {
  const session = useSession()
  const router = useRouter()
  const [{ data: teamsData }] = useTeamsQuery()
  const teamSlug = router.query.teamSlug
  return (
    <nav className="flex justify-center md:container md:mx-auto">
      <TopNavigationLink href="/home">Home</TopNavigationLink>
      <TopNavigationLink href="/time">Time</TopNavigationLink>
      {teamSlug && <TopNavigationLink href={`/${teamSlug}/projects`}>Projects</TopNavigationLink>}
      <TopNavigationLink href="/reports">Reports</TopNavigationLink>
      <TopNavigationLink href={teamSlug ? `/${teamSlug}/team` : '/team'}>Team</TopNavigationLink>
      {teamsData?.teams.map((team) => {
        return (
          <TopNavigationLink href={`/${team.slug}/team`} key={team.id}>
            {team.title}
          </TopNavigationLink>
        )
      })}
      {session.status === 'authenticated' ? (
        <TopNavigationLink onClick={() => signOut({ callbackUrl: '/' })}>Sign out</TopNavigationLink>
      ) : (
        <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
      )}
    </nav>
  )
}
