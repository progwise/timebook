import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '../frontend/styles/globals.css'
import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import { createClient, Provider } from 'urql'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Link from 'next/link'

interface MyAppProps {
  Component: new (props: unknown) => React.Component
  pageProps: {
    session: Session
    [key: string]: unknown
  }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps): JSX.Element {
  const router = useRouter()
  const teamSlug = router.query.teamSlug?.toString()
  const apiRoute = teamSlug ? `/api/${teamSlug}/graphql` : '/api/graphql'

  const client = useMemo(() => createClient({ url: apiRoute }), [apiRoute])

  return (
    <SessionProvider session={session}>
      <Provider value={client}>
        <header className="fixed top-0 w-full border-b-2 bg-gray-200 px-8 py-3">
          <TopNavigation />
        </header>
        <main className="mb-10 mt-12 px-6">
          <Component {...pageProps} />
        </main>
        <footer className="fixed bottom-0 flex h-10 w-full flex-row items-center justify-around bg-gray-200">
          <Link href={'/impress'}>
            <a className="hover:text-blue-500 hover:underline">Impress</a>
          </Link>
          <Link href="/privacy">
            <a className="hover:text-blue-500 hover:underline">Privacy Policy</a>
          </Link>
          <Link href="/privacy">
            <a className="hover:text-blue-500 hover:underline">Conditions</a>
          </Link>
        </footer>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
