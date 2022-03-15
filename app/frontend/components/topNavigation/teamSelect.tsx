import { Menu } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useTeamQuery, useTeamsQuery } from '../../generated/graphql'

function MyLink(props: { [x: string]: unknown; href: string; children: ReactNode }) {
  const { href, children } = props
  return (
    <Link href={href}>
      <span className="hover: delay-25 my-1 mx-1 py-1 px-1 text-indigo-800 transition ease-in-out hover:translate-x-1 hover:scale-100 hover:text-indigo-500  ">
        {children}
      </span>
    </Link>
  )
}
export const TeamSelect = () => {
  const [{ data: teamsData }] = useTeamsQuery()
  const [{ data: teamData }] = useTeamQuery()
  const router = useRouter()
  let classNames = 'relative mx-3 my-3 py-1 px-5 font-semibold text-base'
  classNames =
    router.pathname === '/[teamSlug]/team'
      ? classNames + '  cursor-default  border-b-4 rounded border-indigo-500 text-indigo-500'
      : classNames +
        ' text-indigo-800  cursor-pointer hover:text-indigo-500 hover:border-indigo-500 hover:scale-110 duration-300'

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
