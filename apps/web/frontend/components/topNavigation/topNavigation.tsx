import { parseISO } from 'date-fns'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useMemo } from 'react'
import { AiOutlineFieldTime } from 'react-icons/ai'
import { useQuery } from 'urql'

import { graphql } from '../../generated/gql'
import { LiveDuration } from '../liveDuration/liveDuration'
import { TrackingButtons } from '../trackingButtons/trackingButtons'
import { ProfileMenu } from './profileMenu'
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
    <section className="flex w-full flex-row place-content-between">
      <h1 className="flex min-w-0 items-center gap-2">
        <AiOutlineFieldTime className="text-blue-500" size="2em" />
        <Link href="/" className="text-2xl font-semibold text-blue-400">
          timebook
        </Link>
      </h1>
      {data?.currentTracking && (
        <div className="-m-3 flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-900">
          <div className="flex flex-col text-sm">
            {data.currentTracking.task.title} - {data.currentTracking.task.project.title}
            <div className="flex items-center gap-1 text-xs">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-600" />
              <LiveDuration start={parseISO(data.currentTracking.start)} />
            </div>
          </div>
          <TrackingButtons tracking={data.currentTracking} />
        </div>
      )}
      <nav className="flex flex-row items-center gap-5 dark:text-white">
        {session.status !== 'authenticated' && (
          <TopNavigationLink onClick={() => signIn('github')}>Sign in</TopNavigationLink>
        )}
        <TopNavigationLink href="/week">Week</TopNavigationLink>
        <TopNavigationLink href="/sheet">Sheet</TopNavigationLink>
        <div className="my-1 w-px self-stretch bg-gray-400 dark:bg-blue-400" />
        <TopNavigationLink href="/projects">Projects</TopNavigationLink>
        <TopNavigationLink href="/reports">Reports</TopNavigationLink>
        <ProfileMenu className="ml-3 dark:text-white" />
      </nav>
    </section>
  )
}
