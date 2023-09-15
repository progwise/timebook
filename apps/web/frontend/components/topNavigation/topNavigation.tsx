import { parseISO } from 'date-fns'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { useQuery } from 'urql'

import { graphql } from '../../generated/gql'
import { LiveDuration } from '../liveDuration/liveDuration'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { TopNavigationLink } from './topNavigationLink'

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

  return (
    <header className="navbar sticky top-0 z-20 bg-base-200">
      <h1 className="navbar-start">
        <Link href="/" className="btn btn-ghost text-2xl normal-case">
          <AiOutlineFieldTime className="" />
          timebook
        </Link>
        {data?.currentTracking && (
          <>
            <div className="divider divider-horizontal" />
            <div className="rounded-box flex items-center gap-2 bg-neutral p-2 px-4 text-neutral-content">
              <div className="flex flex-col text-sm">
                {data.currentTracking.task.title} - {data.currentTracking.task.project.title}
                <div className="flex items-center gap-1 text-xs">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-error" />
                  <LiveDuration start={parseISO(data.currentTracking.start)} />
                </div>
              </div>
              <TrackingButtons tracking={data.currentTracking} />
            </div>
          </>
        )}
      </h1>

      <div className="navbar-end">
        <TopNavigationLink href="/week">Week</TopNavigationLink>
        <TopNavigationLink href="/sheet">Sheet</TopNavigationLink>
        <div className="divider divider-horizontal" />
        <TopNavigationLink href="/projects">Projects</TopNavigationLink>
        <TopNavigationLink href="/reports">Reports</TopNavigationLink>
        {/* Ignore the next line because prettier sorts dropdown classes sometimes differently */}
        {/* We have absolutely no idea or control over this, so we just ignore it */}
        {/* prettier-ignore */}
        <div className="dropdown dropdown-end leading-none">
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

          <ul tabIndex={0} className="menu dropdown-content rounded-box menu-sm w-40 bg-base-100 shadow">
            <a onClick={() => signOut({ callbackUrl: '/' })} href="#">
              Sign out
            </a>
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
