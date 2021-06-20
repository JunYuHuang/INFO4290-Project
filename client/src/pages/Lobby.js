import { useState, useEffect } from "react";
import { Row, Col, Container, ListGroup } from "react-bootstrap";
import history from "../history";
import RoomUsersDisplay from "../components/RoomUsersDisplay";
import TopMenuBar from "../components/TopMenuBar";
import TextChat from "../components/TextChat";
import DrawingBoard from "../components/DrawingBoard";

const Lobby = ({ user, setUser, clientRoom }) => {
  // state
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [lobbyUsers, setLobbyUsers] = useState([
    { displayName: "TestUser", points: -99 },
  ]);
  const [secretWord, setSecretWord] = useState("");
  const [roundInfo, setRoundInfo] = useState({
    round: -1,
    maxRounds: -1,
  });
  const [turnTime, setTurnTime] = useState(0);

  // helper functions
  const syncLocalUser = (updatedLobbyUsers) => {
    for (let i = 0; i < updatedLobbyUsers.length; i++) {
      if (updatedLobbyUsers[i].sessionID === user.sessionID) {
        setUser((previousUser) => {
          return {
            ...previousUser,
            isAuthenticated: updatedLobbyUsers[i].isAuthenticated,
            points: updatedLobbyUsers[i].points,
            isDrawer: updatedLobbyUsers[i].isDrawer,
            guessedRight: updatedLobbyUsers[i].guessedRight,
          };
        });
        break;
      }
    }
  };

  useEffect(() => {
    // send user info to room backend to update server state
    let userInfo = {
      sessionID: user.sessionID,
      displayName: user.displayName,
    };
    clientRoom.send("ADD_USER", userInfo);

    // get user messages and game announcements
    clientRoom.onMessage("MESSAGE_SENT", (messagePackage) => {
      setMessageList((previousMessageList) => {
        return [...previousMessageList, messagePackage];
      });
    });

    // get updated list of users whenever some property (e.g. points) of a user changes or if a user joins or leaves the room
    clientRoom.onMessage("USERS_IN_ROOM_UPDATED", (updatedLobbyUsers) => {
      setLobbyUsers(updatedLobbyUsers);
      syncLocalUser(updatedLobbyUsers);
    });

    // sync client when secret word changes on server
    clientRoom.onMessage("WORD_PROMPT_SENT", (word) => {
      setSecretWord(word);
    });

    // sync client when round info changes on server
    clientRoom.onMessage("ROUND_INFO_SENT", (roundInfo) => {
      setRoundInfo(roundInfo);
    });

    // sync client's timer to server's timer
    clientRoom.onMessage("TURN_TIME_UPDATED", (turnTime) => {
      setTurnTime(turnTime);
    });

    // doesn't do anything
    clientRoom.onMessage("GAME_STARTED", (bool) => {
      console.log("Game started!");
    });
  }, []);

  return (
    <Container fluid="xl" className="container container--gameLobbyPage">
      <Row className="d-flex flex-column">
        {/* mb-4  */}
        <h1 className="col col-lg-12 text-center lobby-title">
          <span className="lobby-title--desktop">Guess My Sketch</span>
          <span className="lobby-title--mobile">GMS</span> - Lobby ID&nbsp;
          <span className="text-primary">{user.lobbyID}</span>
        </h1>
      </Row>
      <TopMenuBar
        user={user}
        setUser={setUser}
        clientRoom={clientRoom}
        secretWord={secretWord}
        setSecretWord={setSecretWord}
        roundInfo={roundInfo}
        setRoundInfo={setRoundInfo}
        turnTime={turnTime}
      />
      <Row className="justify-content-between mb-4">
        <Col lg={3} className="d-flex flex-column justify-content-between">
          <ListGroup>
            <RoomUsersDisplay
              user={user}
              usersInRoom={lobbyUsers}
              maxUsersShown={5}
            />
          </ListGroup>
        </Col>
        <Col lg={6}>
          <DrawingBoard user={user} clientRoom={clientRoom} />
        </Col>
        <Col lg={3} className="chat-container-wrapper">
          <TextChat
            user={user}
            clientRoom={clientRoom}
            messageList={messageList}
            message={message}
            setMessage={setMessage}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Lobby;
