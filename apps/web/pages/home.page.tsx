import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'

import { Button } from '@progwise/timebook-ui'

import { PageHeading } from '../frontend/components/pageHeading'
import { TimebookPage } from '../frontend/components/timebookPage'

export default function Home(): JSX.Element {
  const session = useSession()
  return (
    <>
      <Head>
        <title>Timebook: Welcome</title>
        <meta name="description" content="Maintain your work on multiple teams" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <TimebookPage>
        <PageHeading>Welcome</PageHeading>
        <p>This is the new app for reporting your work.</p>
        {session.status !== 'authenticated' && (
          <Button onClick={() => signIn('github')} variant="primary">
            Sign in
          </Button>
        )}
        <section>
          <PageHeading>What is timebook?</PageHeading>
          <p>
            Timebook is a tool for tracking your work on multiple teams. It allows you to log your work hours, and to
            keep track of your tasks and projects.
          </p>
        </section>
      </TimebookPage>
    </>
  )
}
