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

export interface ProfileMenuProps {
  className?: string
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const session = useSession()
  const router = useRouter()
  const teamSlug = router.query.teamSlug

  return (
    <div className={`flex flex-row items-center ${className}`}>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex gap-2">
          {session.data?.user.image && (
            <>
              <Image
                className="rounded-full"
                width={30}
                height={30}
                src={session.data?.user.image}
                alt={session.data?.user.name ?? 'Profile picture'}
              />
              <span className="text-m cursor-pointer whitespace-nowrap text-gray-500 hover:text-blue-500">
                {session.data.user.name}
              </span>
            </>
          )}
        </Menu.Button>

        <Menu.Items className=" absolute right-1 mx-3 flex w-64 flex-col rounded-md bg-white p-2 px-1 shadow ">
          {teamSlug && (
            <>
              <Menu.Item>
                <MyLink href={`/${teamSlug}/team`}>Team</MyLink>
              </Menu.Item>
              <Menu.Item>
                <MyLink href={`/${teamSlug}/time`}>My Timetable</MyLink>
              </Menu.Item>
            </>
          )}
          <Menu.Item>
            <MyLink href="/teams">Manage Teams</MyLink>
          </Menu.Item>
          <Menu.Item>
            {session.status === 'authenticated' && (
              <TopNavigationLink onClick={() => signOut({ callbackUrl: '/' })}>Sign out</TopNavigationLink>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}
