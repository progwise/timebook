import { setDefaultOptions } from 'date-fns'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { withUrqlClient } from 'next-urql'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineFieldTime } from 'react-icons/ai'

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
    <header className="fixed top-32 z-10 w-full border-b-2 bg-gray-200 px-8 py-5 dark:bg-slate-800 dark:text-white print:hidden">
      <TopNavigation />
    </header>
    <header className="navbar bg-base-300 sticky">
      <h1 className="navbar-start">
        <Link href="/" className="btn btn-ghost text-2xl normal-case">
          <AiOutlineFieldTime className="" />
          timebook
        </Link>
      </h1>
      <div className="navbar-end">
        <Link href="/week" className="btn btn-ghost normal-case">
          Week
        </Link>
        <Link href="/sheet" className="btn btn-ghost normal-case">
          Sheet
        </Link>
        <div className="divider divider-horizontal" />
        <Link href="/projects" className="btn btn-ghost normal-case">
          Projects
        </Link>
        <Link href="/reports" className="btn btn-ghost normal-case">
          Reports
        </Link>
        <div className="dropdown dropdown-end ">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <Image
              className="w-10 rounded-full"
              src="https://avatars.githubusercontent.com/u/1886867?v=4"
              alt="User Picture"
              width={30}
              height={30}
            />
          </label>
          <ul tabIndex={0} className="dropdown-content menu rounded-box bg-base-100 menu-sm w-40 shadow">
            <a href="#">Sign out</a>
          </ul>
        </div>
      </div>
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
