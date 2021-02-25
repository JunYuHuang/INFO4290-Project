import { useState } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from "./history";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import * as Colyseus from "colyseus.js";
const faker = require("faker");

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
    isDrawer: false,
  });

  const [clientRoom, setClientRoom] = useState({});

  return (
    <Router history={history}>
      <div className="react-app-container">
        <Switch>
          <Route path="/lobby">
            {user.sessionID === "" ? (
              <Redirect to="/" />
            ) : (
              <Lobby
                user={user}
                setUser={setUser}
                clientRoom={clientRoom}
                setClientRoom={setClientRoom}
                client={client}
              />
            )}
          </Route>
          <Route path="/">
            <Home
              user={user}
              setUser={setUser}
              setClientRoom={setClientRoom}
              client={client}
              faker={faker}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
