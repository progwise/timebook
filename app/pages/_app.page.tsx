import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '../frontend/styles/globals.css'
import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import { createClient, Provider } from 'urql'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { Button } from '../frontend/components/button/button'

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
        <header className="px-5 my-2 border-b-2 bg-transparent">
          <TopNavigation />
        </header>
        <main className="px-5 ">
          <Component {...pageProps} />
        </main>
        <footer className="fixed bottom-0 w-full flex justify-around bg-gray-200">
          <Button className="text-white" variant="tertiary">Impress </Button>
          <Button variant="tertiary"> Privacy Policy </Button>
          <Button variant="tertiary">Conditions </Button>
        </footer>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
