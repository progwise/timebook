import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { useMemo } from 'react'
import { createClient, Provider } from 'urql'

import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import '../frontend/styles/globals.css'

interface MyAppProps {
  Component: (props: unknown) => JSX.Element
  pageProps: {
    session: Session
    [key: string]: unknown
  }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps): JSX.Element {
  const client = useMemo(() => createClient({ url: '/api/graphql' }), [])

  return (
    <SessionProvider session={session}>
      <Provider value={client}>
        <header className="fixed top-0 w-full border-b-2 bg-gray-200 px-8 py-3 dark:bg-slate-800 dark:text-white">
          <TopNavigation />
        </header>
        <main className="mb-10 mt-12 px-6 dark:bg-slate-800 dark:text-white">
          <Component {...pageProps} />
        </main>
        <footer className="fixed bottom-0 flex h-10 w-full flex-row items-center justify-around bg-gray-200 dark:bg-slate-800">
          <Link href="/impress">
            <a className=" hover:text-blue-500 hover:underline dark:bg-slate-800 dark:text-white">Impress</a>
          </Link>
          <Link href="/privacy">
            <a className="hover:text-blue-500 hover:underline dark:bg-slate-800 dark:text-white">Privacy Policy</a>
          </Link>
          <Link href="/privacy">
            <a className="hover:text-blue-500 hover:underline dark:bg-slate-800 dark:text-white">Conditions</a>
          </Link>
        </footer>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
