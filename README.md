# Attack of the Killer Roombas
Matter's example game created in typescript.

Requirements:
- [node.js](https://nodejs.org/)
- [zap](https://zap.redblox.dev/) 
- [rojo](https://rojo.space/)
- [roblox-ts](https://roblox-ts.com/)

To build:
- Clone this repo
- Run `npm install`
- Run `zap src/network.zap `
- Run `rbxtsc build`
- Run `rojo build default.project.json --output example.rbxl`

Then, open `example.rbxl` and play. Enjoy.

## Hot reloading

This example game supports hot reloading, which lets you edit your systems and see the changes you've made in real time,
without needing to stop and start the game.

- Start live syncing from Rojo with the `example` project
- Connect Rojo from Studio while the game is stopped
- Play the game
- Switch to Server view (click the "Current: client" button next to the play and stop buttons)
- Connect to Rojo from Studio again (you might need to go to Plugins > Rojo if the rojo panel is not visible)

Any changes made to the files (or new or deleted files) in `systems` or `clientSystems` will immediately be reflected
in the game.
