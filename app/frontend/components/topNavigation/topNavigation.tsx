import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { TopNavigationLink } from './topNavigationLink'
import { ProfileMenu } from './profileMenu'
import { AiOutlineFieldTime } from 'react-icons/ai'
import Link from 'next/link'

export const TopNavigation = (): JSX.Element => {
  const router = useRouter()
  const teamSlug = router.query.teamSlug
  const session = useSession()

  const handleTimeBookClick = () => router.push(`/home`)

  return (
    <section className="items-strech flex w-full flex-row">
      <h1 className="flex min-w-0 flex-1 flex-row items-center gap-2">
        <AiOutlineFieldTime className="text-blue-500" size={30} />
        <Link href={'/'}>
          <a className="text-2xl font-semibold text-blue-400">timebook</a>
        </Link>
        {teamSlug && (
          <span
            onClick={handleTimeBookClick}
            className="overflow-hidden text-ellipsis whitespace-nowrap text-2xl text-gray-400"
          >
            /{teamSlug}
          </span>
        )}
      </h1>
      <nav className="flex flex-row items-center gap-5">
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
