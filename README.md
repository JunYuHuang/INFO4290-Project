# INFO4290-Project: Guess My Sketch

![Guess My Sketch Splash Preview](assets/guessmysketch-splash.png)

Guess My Sketch is the course project for the class INFO 4290: Integration Project II.

This is an online, multiplayer web application made with

- HTML
- CSS
- JavaScript
- TypeScript
- PostgreSQL
- React
- Node
- Express
- Knex
- Colyseus

SVGs graphics from the [Ionicons icon library](https://ionicons.com/) were also used.

## Prerequisite Software

- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git Bash](https://git-scm.com/downloads)

## Setting up the app (locally) the first time

1. Create a .env file in the root directory.
2. Set the following environment variables according to your local PostgreSQL database settings.

`SESSION_SECRET=yourSessionString`
`PORT=2567`
`REACT_APP_WSS_SERVER_URL=wss://localhost`
`REACT_APP_HTTP_SERVER_URL=https://localhost`
`DATABASE_URL=postgres://yourUsername:yourPassword@localhost:5432/databaseName`

## Installation (with Git Bash)

1. Install server dependencies: `npm install`
2. Install client dependencies: `cd client && npm install`

## Re-compiling the TypeScript Node server

`tsc`

## Re-compiling the React client

1. `cd /INFO4290-Project/client`
2. `npm run build`

## Starting the application

1. `npm start`
