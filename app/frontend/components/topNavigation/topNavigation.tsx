import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { TeamSelect } from './teamSelect'
import { TopNavigationLink } from './topNavigationLink'
import Image from 'next/image'

export const TopNavigation = (): JSX.Element => {
  const session = useSession()
  const router = useRouter()
  const teamSlug = router.query.teamSlug

  return (
    <nav className="flex justify-center md:container md:mx-auto">
      <TopNavigationLink href="/home">Home</TopNavigationLink>
      <TopNavigationLink href="/time">Time</TopNavigationLink>
      {teamSlug && <TopNavigationLink href={`/${teamSlug}/time`}>Time</TopNavigationLink>}
      {teamSlug && <TopNavigationLink href={`/${teamSlug}/projects`}>Projects</TopNavigationLink>}
      {teamSlug && <TopNavigationLink href={`/${teamSlug}/reports`}>Reports</TopNavigationLink>}
      <TopNavigationLink href={teamSlug ? `/${teamSlug}/team` : '/team'}>Team</TopNavigationLink>
      <TeamSelect />
      {session.status === 'authenticated' ? (
        <TopNavigationLink onClick={() => signOut({ callbackUrl: '/' })}>Sign out</TopNavigationLink>
      ) : (
        <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
      )}
      {teamSlug && session.data?.user.image && (
        <TopNavigationLink href={`/${teamSlug}/me`}>
          <Image
            className="rounded-full"
            width={30}
            height={30}
            src={session.data?.user.image}
            alt={session.data?.user.name ?? 'Profile picture'}
          />
        </TopNavigationLink>
      )}
    </nav>
  )
}
