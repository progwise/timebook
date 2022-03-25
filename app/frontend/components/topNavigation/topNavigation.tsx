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
    <>
      <div className="flex justify-end md:container md:mx-auto">
        <span
          onClick={handleTimeBookClick}
          className=" mx-3 my-3 cursor-pointer rounded-full  py-1 px-4 text-xl font-semibold text-blue-400"
        >
          timebook
        </span>
        <nav className="flex justify-end md:container md:mx-auto">
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

          <ProfileMenu />
        </nav>
      </div>
    </>
  )
}
