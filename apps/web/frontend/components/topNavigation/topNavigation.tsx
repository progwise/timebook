import { parseISO } from 'date-fns'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef } from 'react'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { FaAlignJustify } from 'react-icons/fa6'
import { useQuery } from 'urql'

import { graphql } from '../../generated/gql'
import { LiveDuration } from '../liveDuration/liveDuration'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { TopNavigationLink } from './topNavigationLink'
import { TopNavigationMenuLink } from './topNavigationMenuLink'

const CurrentTrackingQueryDocument = graphql(`
  query currentTracking {
    currentTracking {
      ...TrackingButtonsTracking
      start
      task {
        title
        project {
          title
        }
      }
    }
  }
`)

export const TopNavigation = (): JSX.Element => {
  const currentTrackingContext = useMemo(() => ({ additionalTypenames: ['Tracking', 'Task', 'Project'] }), [])
  const [{ data }] = useQuery({ query: CurrentTrackingQueryDocument, context: currentTrackingContext })
  const session = useSession()
  const drawerCheckboxReference = useRef<HTMLInputElement>(null)

  const handleMenuLinkClick = () => {
    if (drawerCheckboxReference.current) {
      drawerCheckboxReference.current.checked = false
    }
  }

  return (
    <header className="navbar fixed top-0 z-50 gap-2 bg-base-100 shadow-lg">
      <h1 className="navbar-start max-md:w-full max-md:justify-between">
        <div className="drawer z-10 w-min md:hidden">
          <input id="drawer" type="checkbox" className="drawer-toggle" ref={drawerCheckboxReference} />
          <span className="drawer-content">
            <label htmlFor="drawer" aria-label="open sidebar" className="btn btn-ghost text-2xl">
              <FaAlignJustify />
            </label>
          </span>
          <div className="drawer-side">
            <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay" />
            <ul className="menu menu-lg min-h-full w-80 bg-base-200 p-4">
              <li className="menu-title">
                <span className="flex items-center gap-1 text-2xl text-base-content">
                  <AiOutlineFieldTime />
                  timebook
                </span>
              </li>

              <li>
                <TopNavigationMenuLink href="/week" onClick={handleMenuLinkClick}>
                  Week
                </TopNavigationMenuLink>
              </li>
              <li>
                <TopNavigationMenuLink href="/sheet" onClick={handleMenuLinkClick}>
                  Sheet
                </TopNavigationMenuLink>
              </li>
              <li>
                <TopNavigationMenuLink href="/projects" onClick={handleMenuLinkClick}>
                  Projects
                </TopNavigationMenuLink>
              </li>
              <li>
                <TopNavigationMenuLink href="/reports" onClick={handleMenuLinkClick}>
                  Reports
                </TopNavigationMenuLink>
              </li>
              <li className="grow justify-end">
                <div className="divider divider-neutral -m-2 gap-0" />
              </li>
              <li>
                <TopNavigationMenuLink href="/access-tokens" onClick={handleMenuLinkClick}>
                  Access tokens
                </TopNavigationMenuLink>
              </li>
              <li>
                <a onClick={() => signOut({ callbackUrl: '/' })} href="#">
                  Sign out
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Link href="/" className="btn btn-ghost text-2xl normal-case max-md:hidden">
          <AiOutlineFieldTime />
          <span className="max-lg:hidden">timebook</span>
        </Link>
        {data?.currentTracking && (
          <>
            <div className="divider divider-horizontal m-1 max-lg:hidden" />
            <div className="flex items-center gap-2 rounded-box bg-neutral p-2 px-4 text-neutral-content">
              <div className="flex flex-col text-sm">
                {data.currentTracking.task.title} - {data.currentTracking.task.project.title}
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-block size-2 animate-pulse rounded-full bg-error" />
                  <LiveDuration start={parseISO(data.currentTracking.start)} />
                </div>
              </div>
              <TrackingButtons tracking={data.currentTracking} />
            </div>
          </>
        )}
      </h1>

      <div className="navbar-end gap-1 max-md:hidden">
        <TopNavigationLink href="/week">Week</TopNavigationLink>
        <TopNavigationLink href="/sheet">Sheet</TopNavigationLink>
        <div className="divider divider-horizontal m-0" />
        <TopNavigationLink href="/projects">Projects</TopNavigationLink>
        <TopNavigationLink href="/reports">Reports</TopNavigationLink>
        {/* Ignore the next line because prettier sorts dropdown classes sometimes differently */}
        {/* We have absolutely no idea or control over this, so we just ignore it */}
        {/* prettier-ignore */}
        <div className="dropdown dropdown-end leading-none dropdown-hover">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            {session.data?.user.image && (
              <Image
                className="rounded-full"
                width={48}
                height={48}
                src={session.data?.user.image}
                alt={session.data?.user.name ?? 'Profile picture'}
              />
            )}
          </label>

          <ul tabIndex={0} className="menu dropdown-content rounded-box menu-sm w-40 bg-base-100 shadow p-2">
            <li><Link href="/access-tokens" onClick={(event) => event.currentTarget.blur()}>Access tokens</Link></li>
            <li><a onClick={() => signOut({ callbackUrl: '/' })} href="#">
              Sign out
            </a></li>
          </ul>
        </div>
        {session.status !== 'authenticated' && (
          <button className="btn btn-primary normal-case" onClick={() => signIn('github')}>
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
