import { setDefaultOptions } from 'date-fns'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { withUrqlClient } from 'next-urql'
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
    <div className="flex h-screen flex-col justify-between">
      <TopNavigation />
      <main className="container mx-auto print:m-0 print:p-0">
        <Component {...pageProps} />
      </main>
      <footer className="footer justify-items-center bg-base-200 p-5">
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
