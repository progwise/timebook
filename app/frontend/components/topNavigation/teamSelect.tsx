import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useTeamQuery, useTeamsQuery } from '../../generated/graphql'

function MyLink(props: { [x: string]: unknown; href: string; children: ReactNode }) {
  const { href, children } = props
  return (
    <Link href={href}>
      <span className="my-1 mx-1 py-1 px-1 text-blue-500 hover:text-indigo-900 ">{children}</span>
    </Link>
  )
}
export const TeamSelect = () => {
  const [{ data: teamsData }] = useTeamsQuery()
  const [{ data: teamData }] = useTeamQuery()
  const router = useRouter()
  let classNames =
    'relative mx-3 my-3 bg-transparent text-indigo-500 font-semibold py-1 px-4 border border-indigo-300 rounded'
  classNames =
    router.pathname === '/[teamSlug]/team'
      ? classNames + ' cursor-default text-indigo-900 border-indigo-900'
      : classNames + ' cursor-pointer hover:text-indigo-900 hover:border-indigo-900'
  console.log(router.pathname)

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
