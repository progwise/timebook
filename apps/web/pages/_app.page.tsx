import { setDefaultOptions } from 'date-fns'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { withUrqlClient } from 'next-urql'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cacheExchange, fetchExchange } from 'urql'

import { TimebookToaster } from '@progwise/timebook-ui'

import { TopNavigation } from '../frontend/components/topNavigation/topNavigation'
import '../frontend/styles/globals.css'

setDefaultOptions({
  weekStartsOn: 1, // start weeks on Monday
})

interface TimebookProps extends AppProps {
  pageProps: {
    session?: Session
    [key: string]: unknown
  }
}

const TimebookApp = ({ Component, pageProps }: TimebookProps): JSX.Element => {
  const { session, ...restPageProps } = pageProps || { session: undefined }
  // Hydration https://nextjs.org/docs/messages/react-hydration-error
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div />

  return (
    <SessionProvider session={session}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex min-h-screen flex-col justify-between">
        <TopNavigation />
        <div className="overflow-x-auto">
          <main className="container mx-auto mb-4 mt-20 max-md:min-h-screen print:m-0 print:p-0">
            <Component {...restPageProps} />
          </main>
        </div>
        <footer className="footer justify-items-center bg-base-300 p-2 print:hidden">
          <Link href="/impress" className="link-hover link">
            Impress
          </Link>
          <Link href="/privacy" className="link-hover link">
            Privacy Policy
          </Link>
          <Link href="/privacy" className="link-hover link">
            Conditions
          </Link>
        </footer>
      </div>
      <TimebookToaster />
    </SessionProvider>
  )
}

export default withUrqlClient(
  (_ssrExchange, context) => ({
    url: `${process.env.NEXTAUTH_URL ?? ''}/api/graphql`,
    exchanges: [cacheExchange, fetchExchange],
    fetchOptions: () => ({
      headers: {
        cookie: context ? (context.req?.headers.cookie ?? '') : document.cookie,
      },
    }),
    requestPolicy: 'cache-and-network',
  }),
  { ssr: true },
)(TimebookApp)
