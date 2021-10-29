import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import '../frontend/styles/globals.css'
import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import { createClient, Provider } from 'urql'

const client = createClient({ url: '/api/graphql' })

interface MyAppProps {
    Component: new (props: unknown) => React.Component
    pageProps: {
        session: Session
        [key: string]: unknown
    }
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps): JSX.Element {
    return (
        <SessionProvider session={session}>
            <Provider value={client}>
                <header className="bg-indigo-50">
                    <TopNavigation />
                </header>
                <main className="md:m-auto md:w-2/3">
                    <Component {...pageProps} />
                </main>
                <footer>Impress</footer>
            </Provider>
        </SessionProvider>
    )
}

export default MyApp
