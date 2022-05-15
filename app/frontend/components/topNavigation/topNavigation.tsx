import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { TopNavigationLink } from './topNavigationLink'
import { ProfileMenu } from './profileMenu'

export const TopNavigation = (): JSX.Element => {
  const router = useRouter()
  const teamSlug = router.query.teamSlug
  const session = useSession()

  const handleTimeBookClick = () => router.push(`/home`)

  return (
    <section className="items-strech flex w-full flex-row">
      <h1 className="flex flex-1 min-w-0 flex-row">
        <span className="text-2xl font-semibold text-blue-400">timebook</span>
        {teamSlug && (
          <span onClick={handleTimeBookClick} className="text-2xl text-gray-400 text-ellipsis overflow-hidden whitespace-nowrap">
            /{teamSlug}
          </span>
        )}
      </h1>
      <nav className="flex flex-row items-center gap-5">
        <TopNavigationLink href="/home">Home</TopNavigationLink>
        {session.status === 'authenticated' ? (
          <>
            <TopNavigationLink href={teamSlug ? `/${teamSlug}/team` : '/team'}>Team</TopNavigationLink>
          </>
        ) : (
          <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
        )}

        {teamSlug && <TopNavigationLink href={`/${teamSlug}/time`}>Time</TopNavigationLink>}
        {teamSlug && <TopNavigationLink href={`/${teamSlug}/projects`}>Projects</TopNavigationLink>}
        {teamSlug && <TopNavigationLink href={`/${teamSlug}/reports`}>Reports</TopNavigationLink>}

        <ProfileMenu className="ml-3" />
      </nav>
    </section>
  )
}
