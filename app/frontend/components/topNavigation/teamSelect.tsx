import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { ReactNode } from 'react'
import { useTeamQuery, useTeamsQuery } from '../../generated/graphql'

function MyLink(props: { [x: string]: unknown; href: string; children: ReactNode }) {
  const { href, children, ...rest } = props
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}
export const TeamSelect = () => {
  const [{ data: teamsData }] = useTeamsQuery()
  const [{ data: teamData }] = useTeamQuery()

  return (
    <Menu as="div" className="relative mx-3 my-3 py-1 px-4">
      <Menu.Button>{teamData ? <span className="w-9">{teamData.team.title} </span> : 'more'}</Menu.Button>
      <Menu.Items className="absolute right-0 bg-white shadow p-4 rounded-md w-full flex flex-col">
        {teamsData?.teams.map((team) => {
          return (
            <Menu.Item key={team.id}>
              {({ active }) => (
                <MyLink className={`${active && 'bg-blue-500'}`} href={`/${team.slug}/team`}>
                  {team.title}
                </MyLink>
              )}
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
