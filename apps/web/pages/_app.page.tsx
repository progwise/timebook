import { setDefaultOptions } from 'date-fns'
import { de } from 'date-fns/locale'
import { NextPageContext } from 'next'
import { Session } from 'next-auth'
import { getSession, SessionProvider } from 'next-auth/react'
import { withUrqlClient } from 'next-urql'
import Link from 'next/link'

import { TimebookToaster } from '@progwise/timebook-ui'

import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import '../frontend/styles/globals.css'

setDefaultOptions({
  weekStartsOn: 1, // Montag als Wochenstart
  locale: de, // Deutsche Lokalisierung
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
    <header className="fixed top-0 w-full border-b-2 bg-gray-200 px-8 py-5 dark:bg-slate-800 dark:text-white print:hidden">
      <TopNavigation />
    </header>
    <main className="container mx-auto mb-10 mt-16 px-6 dark:bg-slate-800 dark:text-white print:m-0 print:p-0">
      <Component {...pageProps} />
    </main>
    <footer className="fixed bottom-0 flex h-10 w-full flex-row items-center justify-around bg-gray-200 dark:bg-slate-800 print:hidden">
      <Link href="/impress" className="hover:text-blue-500 hover:underline dark:bg-slate-800 dark:text-white">
        Impress
      </Link>
      <Link href="/privacy" className="hover:text-blue-500 hover:underline dark:bg-slate-800 dark:text-white">
        Privacy Policy
      </Link>
      <Link href="/privacy" className="hover:text-blue-500 hover:underline dark:bg-slate-800 dark:text-white">
        Conditions
      </Link>
    </footer>
    <TimebookToaster />
  </SessionProvider>
)

TimebookApp.getInitialProps = async (context: NextPageContext) => ({
  session: await getSession(context),
})

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
