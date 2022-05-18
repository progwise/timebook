import { Menu } from '@headlessui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

import { TopNavigationLink } from './topNavigationLink'
import Image from 'next/image'
import { ReactNode } from 'react'
import Link from 'next/link'
import { useTeamsQuery } from '../../generated/graphql'

function MyLink(props: { [x: string]: unknown; href: string; children: ReactNode }) {
  const { href, children } = props
  return (
    <Link href={href} passHref>
      <span className="delay-25 my-1 mx-6 cursor-pointer py-1 px-1 text-blue-400 duration-300 hover:translate-x-1 hover:text-indigo-500">
        {children}
      </span>
    </Link>
  )
}
export const ProfileMenu = () => {
  const session = useSession()
  const router = useRouter()
  const teamSlug = router.query.teamSlug
  const [{ data: teamsData }] = useTeamsQuery()
  let classNames = ' relative mx-3 my-3 bg-transparent py-1 px-4 font-semibold'
  classNames =
    router.pathname === '/[teamSlug]/team'
      ? classNames + ' cursor-default '
      : classNames + ' cursor-pointer  duration-300  '

  return (
    <Menu as="div" className={classNames}>
      <Menu.Button className="">
        {session.data?.user.image && (
          <Image
            className="rounded-full"
            width={30}
            height={30}
            src={session.data?.user.image}
            alt={session.data?.user.name ?? 'Profile picture'}
          />
        )}
      </Menu.Button>

      <Menu.Items className=" absolute right-1 mx-3 flex w-64 flex-col rounded-md bg-white p-2 px-1 shadow ">
        {teamSlug && (
          <Menu.Item>
            <MyLink href={`/${teamSlug}/me`}>Profile</MyLink>
          </Menu.Item>
        )}
        <Menu.Item>
          <MyLink href="/time">My Timetable</MyLink>
        </Menu.Item>
        {teamsData && teamsData.teams.length > 0 && (
          <Menu.Item>
            <MyLink href="/teams">Switch Team</MyLink>
          </Menu.Item>
        )}
        <Menu.Item>
          {session.status === 'authenticated' ? (
            <TopNavigationLink onClick={() => signOut({ callbackUrl: '/' })}>Sign out</TopNavigationLink>
          ) : (
            <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
