//
// IMPORTS & SERVER INITIALIZATION
//
const colyseus = require("colyseus");
const http = require("http");
const express = require("express");
const port = process.env.port || 3001;

const app = express();
app.use(express.json());

const gameServer = new colyseus.Server({
  server: http.createServer(app),
});

gameServer.listen(port);

console.log(`Game server is running at port ${port}!`);

//
// ROOM HANDLER
//

// export class MyRoom extends colyseus.Room {
//   // When room is initialized
//   onCreate(options) {}

//   // Authorize client based on provided options before WebSocket handshake is complete
//   onAuth(client, options, request) {}

//   // When client successfully join the room
//   onJoin(client, options, auth) {}

//   // When a client leaves the room
//   onLeave(client, consented) {}

//   // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
//   onDispose() {}
// }
