import { signIn, signOut, useSession } from 'next-auth/react'
import { TopNavigationLink } from './topNavigationLink'

export const TopNavigation = (): JSX.Element => {
  const session = useSession()

  return (
    <nav className="md:container md:mx-auto flex justify-center">
      <TopNavigationLink href="/home">HomePage</TopNavigationLink>
      <TopNavigationLink href="/time">Time</TopNavigationLink>
      <TopNavigationLink href="/projects">Projects</TopNavigationLink>
      <TopNavigationLink href="/reports">Reports</TopNavigationLink>
      {session.status === 'authenticated' ? (
        <TopNavigationLink onClick={() => signOut({ callbackUrl: '/' })}>Sign out</TopNavigationLink>
      ) : (
        <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
      )}
    </nav>
  )
}
