import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '../frontend/styles/globals.css'
import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import { createClient, Provider } from 'urql'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

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
        <header className="bg-indigo-50">
          <TopNavigation />
        </header>
        <main className="md:m-auto md:w-2/3">
          <Component {...pageProps} />
        </main>
        <footer className="text-right mr-28 mt-80">Impress</footer>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
