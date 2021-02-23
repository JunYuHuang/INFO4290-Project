import { useState } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./history";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import CreateLobby from "./pages/CreateLobby";
import JoinLobby from "./pages/JoinLobby";
import * as Colyseus from "colyseus.js";

// connect to the game server
const SOCKET_SERVER_URL = "ws://localhost:2567/";
let client = new Colyseus.Client(SOCKET_SERVER_URL);

const App = () => {
  // state
  const [user, setUser] = useState({
    sessionID: "",
    displayName: "",
    authenticated: false,
    lobbyID: "",
    points: 0,
  });

  const [clientRoom, setClientRoom] = useState({});

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
                client={client}
              />
            )}
          </Route> */}
          <Route path="/gameLobby">
            <Lobby
              user={user}
              setUser={setUser}
              clientRoom={clientRoom}
              setClientRoom={setClientRoom}
              client={client}
            />
          </Route>
          <Route path="/createGameLobby">
            <CreateLobby
              user={user}
              setUser={setUser}
              setClientRoom={setClientRoom}
              client={client}
            />
          </Route>
          <Route path="/joinGameLobby">
            <JoinLobby
              user={user}
              setUser={setUser}
              setClientRoom={setClientRoom}
              client={client}
            />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
