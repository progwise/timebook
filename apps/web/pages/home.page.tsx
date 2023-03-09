import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'

import { Button } from '@progwise/timebook-ui'

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
        <h2 className="font-bold">Welcome</h2>
        <p>This is the new app for reporting your work.</p>
        {session.status !== 'authenticated' && (
          <Button onClick={() => signIn('github')} variant="primary">
            Sign in
          </Button>
        )}
        <section>
          <h2 className="font-bold">What is timebook?</h2>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
            dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
            clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
            consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
            sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no
            sea takimata sanctus est Lorem ipsum dolor sit amet.
          </p>
        </section>
      </TimebookPage>
    </>
  )
}
