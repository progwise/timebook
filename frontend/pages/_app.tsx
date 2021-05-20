import '../styles/globals.css'
import {TopNavigation} from '../components/topNavigation/topNavigation';

function MyApp({Component, pageProps}) {
  return (
    <>
      <header className='bg-indigo-50'>
        <TopNavigation />
      </header>
      <main className="md:m-auto md:w-2/3">
        <Component {...pageProps} />
      </main>
      <footer>
        Impress
      </footer>
    </>
  )
}

export default MyApp
