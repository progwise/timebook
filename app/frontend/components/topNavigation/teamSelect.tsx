import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useTeamQuery, useTeamsQuery } from '../../generated/graphql'
function MyLink(props: { [x: string]: unknown; href: string; children: ReactNode }) {
  const { href, children } = props
  return (
    <Link href={href}>
      <span className="delay-25 my-1 mx-1 py-1 px-1 text-blue-400 duration-300 hover:translate-x-1 hover:text-indigo-500">
        {children}
      </span>
    </Link>
  )
}
export const TeamSelect = () => {
  const [{ data: teamsData }] = useTeamsQuery()
  const [{ data: teamData }] = useTeamQuery()
  const router = useRouter()
  let classNames = 'relative mx-3 my-3 bg-transparent py-1 px-4 font-semibold'
  classNames =
    router.pathname === '/[teamSlug]/team'
      ? classNames + ' cursor-default text-white border-2 bg-blue-400 border-blue-400 rounded-full'
      : classNames + ' cursor-pointer text-blue-400 hover:text-blue-500 hover:scale-105 duration-300  '

  return (
    <Menu as="div" className={classNames}>
      <Menu.Button className="font-semibold">
        {teamData ? <span className="w-9">{teamData.team.title} </span> : 'Your Teams'}
      </Menu.Button>
      <Menu.Items className="absolute left-0 mx-3 flex w-64 flex-col rounded-md bg-white p-4 px-1 shadow">
        {teamsData?.teams.map((team) => {
          return (
            <Menu.Item key={team.id}>
              <MyLink href={`/${team.slug}/team`}>{team.title}</MyLink>
            </Menu.Item>
          )
        })}
        <Menu.Item>
          {({ active }) => (
            <MyLink className={`${active && 'bg-blue-500'}`} href="/team">
              Create new team
            </MyLink>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )
}
