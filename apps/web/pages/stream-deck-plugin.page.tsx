/* eslint-disable unicorn/filename-case */
import Image from 'next/image'

import { ProtectedPage } from '../frontend/components/protectedPage'

const StreamDeckPluginPage = (): JSX.Element => {
  return (
    <ProtectedPage>
      <div className="prose max-w-none pt-2">
        <h1>Stream Deck Plugin</h1>
        <p>
          This plugin allows you to start, track and stop your Timebook timers using{' '}
          <a href="https://www.elgato.com/en/stream-deck" className="link link-primary">
            Elgato Stream Deck
          </a>
          .
        </p>
        <h2>Download</h2>
        <p>
          Until the plugin is available in the Stream Deck Store, you can download it by clicking{' '}
          <a className="link link-primary" href="/net.progwise.timebook.streamDeckPlugin">
            here
          </a>
          .
        </p>
        <h2>Setup</h2>
        <p>
          After installation, drag the <code>Time tracking</code> option from the menu on the right to a button, fill
          the required fields.
        </p>
        <Image src="/stream-deck-img-1.png" alt="Elgato Stream deck app view" width={700} height={400} />
        <ul>
          <li>Title: (optional) Override the title being set by the plugin, leave empty otherwise</li>
          <li>URL: (optional) Paste a link if you are using a custom build, leave empty otherwise</li>
          <li>
            Access token: (required) Provide your Timebook{' '}
            <a href="/access-tokens" className="link link-primary">
              access token
            </a>
            , which is required for the plugin to work
          </li>
        </ul>
        <h2>Troubleshooting</h2>
        <ul>
          <li>
            Why am I getting a yellow triangle when pressing the button? Why am I not seeing the running timer on my
            button?
            <ul>
              <li>Make sure to use a correct access token</li>
              <li>Make sure title is not set, as this will override any other content</li>
              <li>Make sure you have not set a URL or set it properly</li>
            </ul>
          </li>
          <li>
            Why does it take some seconds to show the timer running?
            <ul>
              <li>Site is under a load/slow.</li>
            </ul>
          </li>
          <li>
            Why is a task greyed out/not clickable?
            <ul>
              <li>It is locked.</li>
            </ul>
          </li>
        </ul>
      </div>
    </ProtectedPage>
  )
}
export default StreamDeckPluginPage
