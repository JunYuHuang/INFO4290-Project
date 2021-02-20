import { useState } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./history";
import HomePage from "./pages/HomePage";
import GameLobbyPage from "./pages/GameLobbyPage";
import CreateGameLobbyPage from "./pages/CreateLobbyPage";
import JoinGameLobbyPage from "./pages/JoinGameLobby";
import * as Colyseus from "colyseus.js";

// connect to the game server
const SOCKET_SERVER_URL = "ws://localhost:3001/";
let client = new Colyseus.Client(SOCKET_SERVER_URL);

const App = () => {
  // state
  const [username, setUsername] = useState("");
  const [gameLobbyID, setGameLobbyID] = useState("");

  return (
    <Router history={history}>
      <div className="react-app-container">
        <Switch>
          {/* <Route path="/gameLobby">
            {username === "" ? (
              <Redirect to="/" />
            ) : (
              <GameLobbyPage
                username={username}
                setUsername={setUsername}
                gameLobbyID={gameLobbyID}
                setGameLobbyID={setGameLobbyID}
                colyseusClient={client}
              />
            )}
          </Route> */}
          <Route path="/gameLobby">
            <GameLobbyPage
              username={username}
              setUsername={setUsername}
              gameLobbyID={gameLobbyID}
              setGameLobbyID={setGameLobbyID}
              colyseusClient={client}
            />
          </Route>
          <Route path="/createGameLobby">
            <CreateGameLobbyPage
              username={username}
              setUsername={setUsername}
              setGameLobbyID={setGameLobbyID}
              colyseusClient={client}
            />
          </Route>
          <Route path="/joinGameLobby">
            <JoinGameLobbyPage
              username={username}
              setUsername={setUsername}
              gameLobbyID={gameLobbyID}
              setGameLobbyID={setGameLobbyID}
              colyseusClient={client}
            />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
