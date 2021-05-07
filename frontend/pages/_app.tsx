import '../styles/globals.css'
import {TopNavigation} from '../components/topNavigation';

function MyApp({Component, pageProps}) {
  return (
    <>
      <header>
        <h1>Welcome to timetable</h1>
        <TopNavigation />
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer>
        Impress
      </footer>
    </>
  )
}

export default MyApp
