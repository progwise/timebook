import streamDeck, { LogLevel } from '@elgato/streamdeck'

import { Tracking } from './actions/tracking'

// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE)

// Register the tracking action.
streamDeck.actions.registerAction(new Tracking())

// Finally, connect to the Stream Deck.
streamDeck.connect()
