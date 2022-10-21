import { Menu } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

import { TopNavigationLink } from './topNavigationLink'

export interface ProfileMenuProps {
  className?: string
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const session = useSession()

  return (
    <div className={`flex flex-row items-center  ${className}`}>
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
              <span className="text-m cursor-pointer whitespace-nowrap text-gray-500 hover:text-blue-500 dark:text-white">
                {session.data.user.name}
              </span>
            </>
          )}
        </Menu.Button>

        <Menu.Items className=" absolute right-1 mx-3 flex w-64 flex-col rounded-md  bg-white p-2 px-1 shadow dark:bg-slate-800 ">
          <Menu.Item>
            {session.status === 'authenticated' && (
              <>
                <TopNavigationLink className="dark:text-white " onClick={() => signOut({ callbackUrl: '/' })}>
                  Sign out
                </TopNavigationLink>
              </>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}
