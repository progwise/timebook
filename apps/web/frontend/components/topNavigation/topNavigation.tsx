import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineFieldTime } from 'react-icons/ai'

import { ProfileMenu } from './profileMenu'
import { TopNavigationLink } from './topNavigationLink'

export const TopNavigation = (): JSX.Element => {
  const router = useRouter()
  const teamSlug = router.query.teamSlug
  const session = useSession()

  const handleTimeBookClick = () => router.push(`/home`)

  return (
    <section className="items-strech flex  w-full flex-row ">
      <h1 className="flex min-w-0 flex-1 flex-row  items-center gap-2">
        <AiOutlineFieldTime className="text-blue-500" size="2em" />
        <Link href="/">
          <a className="text-2xl font-semibold text-blue-400">timebook</a>
        </Link>
        {teamSlug && (
          <span
            onClick={handleTimeBookClick}
            className="overflow-hidden text-ellipsis whitespace-nowrap  text-2xl text-gray-400"
          >
            /{teamSlug}
          </span>
        )}
      </h1>
      <nav className="flex flex-row items-center gap-5 dark:text-white">
        {session.status !== 'authenticated' && (
          <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
        )}

        <TopNavigationLink href="/time">Time</TopNavigationLink>
        <TopNavigationLink href="/time/sheet">Sheet</TopNavigationLink>
        <TopNavigationLink href="/projects">Projects</TopNavigationLink>
        <TopNavigationLink href="/reports">Reports</TopNavigationLink>

        {teamSlug && <TopNavigationLink href={`/${teamSlug}/team`}>Team</TopNavigationLink>}

        <ProfileMenu className="ml-3 dark:text-white " />
      </nav>
    </section>
  )
}
