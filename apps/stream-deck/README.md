# Stream deck plugin

The fastest way to get started with Stream Deck is using the plugin template.
https://docs.elgato.com/sdk/plugins/getting-started

# Packaging

When the plugin is finalized, you should create a `.streamDeckPlugin` file using `pnpm streamdeck bundle ./net.progwise.timebook.sdPlugin ` in `apps/stream-deck`. The command validates your icon pack and produces a .streamDeckPlugin file which can be used for distribution. If the export is successful you should see the following:

`✔ Successfully packaged plugin`
