import "../styles/globals.css";
import { TopNavigation } from "../components/topNavigation/topNavigation";
import { createClient, Provider } from "urql";

const client = createClient({
  url: "http://localhost:4000/graphql",
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <header className="bg-indigo-50">
        <TopNavigation />
      </header>
      <main className="md:m-auto md:w-2/3">
        <Component {...pageProps} />
      </main>
      <footer>Impress</footer>
    </Provider>
  );
}

export default MyApp;
