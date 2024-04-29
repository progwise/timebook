import { setDefaultOptions } from 'date-fns'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { withUrqlClient } from 'next-urql'
import Head from 'next/head'
import Link from 'next/link'

import { TimebookToaster } from '@progwise/timebook-ui'

import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import '../frontend/styles/globals.css'

setDefaultOptions({
  weekStartsOn: 1, // start weeks on monday
})

interface TimebookProps {
  Component: (props: unknown) => JSX.Element
  session: Session | undefined
  pageProps?: {
    [key: string]: unknown
  }
}

const TimebookApp = ({ Component, session, pageProps }: TimebookProps): JSX.Element => (
  <SessionProvider session={session}>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className="flex min-h-screen flex-col justify-between">
      <TopNavigation />
      <div className="overflow-x-auto">
        <main className="container mx-auto py-16 max-md:min-h-screen print:m-0 print:p-0">
          <Component {...pageProps} />
        </main>
      </div>
      <footer className="footer justify-items-center bg-base-300 p-5">
        <Link href="/impress" className="link-hover link">
          Impress
        </Link>
        <Link href="/privacy" className="link-hover link">
          Privacy Policy
        </Link>
        <Link href="/privacy" className="link-hover link">
          Conditions
        </Link>
      </footer>
    </div>
    <TimebookToaster />
  </SessionProvider>
)

export default withUrqlClient(
  (_ssrExchange, context) => ({
    url: `${process.env.NEXTAUTH_URL ?? ''}/api/graphql`,
    fetchOptions: () => ({
      headers: {
        cookie: context ? context.req?.headers.cookie ?? '' : document.cookie,
      },
    }),
  }),
  { ssr: true },
)(TimebookApp)
