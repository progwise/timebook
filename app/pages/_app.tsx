import '../frontend/styles/globals.css'
import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import { createClient, Provider } from 'urql'

const client = createClient({ url: '/api/graphql' })

interface MyAppProps {
    Component: new (props: unknown) => React.Component
    pageProps: never
}

function MyApp({ Component, pageProps }: MyAppProps): JSX.Element {
    return (
        <Provider value={client}>
            <header className="bg-indigo-50">
                <TopNavigation />
            </header>
            <main className="md:m-auto md:w-2/3">
                <Component {...pageProps} />
            </main>
            <footer className="text-right mr-28 mt-80">Impress</footer>
        </Provider>
    )
}

export default MyApp
