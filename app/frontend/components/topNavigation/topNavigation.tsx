import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { RiAccountPinCircleFill } from 'react-icons/ri'
import { TeamSelect } from './teamSelect'
import { TopNavigationLink } from './topNavigationLink'
import Image from 'next/image'

export const TopNavigation = (): JSX.Element => {
  const session = useSession()
  const router = useRouter()
  const teamSlug = router.query.teamSlug

  session.data?.user.image
  return (
    <nav className="flex justify-center md:container md:mx-auto">
      <TopNavigationLink href="/home">Home</TopNavigationLink>
      <TopNavigationLink href="/time">Time</TopNavigationLink>
      {teamSlug && <TopNavigationLink href={`/${teamSlug}/projects`}>Projects</TopNavigationLink>}
      <TopNavigationLink href="/reports">Reports</TopNavigationLink>
      <TopNavigationLink href={teamSlug ? `/${teamSlug}/team` : '/team'}>Team</TopNavigationLink>
      <TeamSelect />
      {session.status === 'authenticated' ? (
        <TopNavigationLink onClick={() => signOut({ callbackUrl: '/' })}>Sign out</TopNavigationLink>
      ) : (
        <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
      )}
      <TopNavigationLink href={`/${teamSlug}/me`}>
        {session.data?.user.image ? (
          <Image className="rounded-full" width={30} height={30} src={session.data?.user.image} alt="Profile picture" />
        ) : (
          <RiAccountPinCircleFill className="text-2xl" />
        )}
      </TopNavigationLink>
    </nav>
  )
}
