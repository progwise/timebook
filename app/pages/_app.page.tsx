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
        <header className="px-5 border-b-2 bg-transparent">
          <TopNavigation />
        </header>
        <main className="">
          <Component {...pageProps} />
        </main>
        <footer className="mt-80 flex w-full justify-start bg-gray-200 md:container md:mx-auto">
          <Button className="text-white" variant="tertiary">Impress </Button>
          <Button variant="tertiary"> Privacy Policy </Button>
          <Button variant="tertiary">Conditions </Button>
        </footer>
      </Provider>
    </SessionProvider>
  )
}

export default MyApp
