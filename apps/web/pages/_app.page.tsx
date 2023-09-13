/* eslint-disable tailwindcss/no-custom-classname */
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
    <TopNavigation />
    <main className="container mx-auto mb-10 mt-16 px-6 dark:bg-slate-800 dark:text-white print:m-0 print:p-0">
      <Component {...pageProps} />
    </main>
    <footer className="footer bg-base-200 bot-0 justify-items-center p-5">
      <Link href="/impress" className="link link-hover">
        Impress
      </Link>
      <Link href="/privacy" className="link link-hover">
        Privacy Policy
      </Link>
      <Link href="/privacy" className="link link-hover">
        Conditions
      </Link>
    </footer>
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
