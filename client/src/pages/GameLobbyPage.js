import { useState, useEffect } from "react";
import { Row, Col, Container, ListGroup } from "react-bootstrap";
import history from "../history";
import RoomUsersDisplay from "../components/RoomUsersDisplay";
import TopMenuBar from "../components/TopMenuBar";
import TextChat from "../components/TextChat";
import DrawingBoard from "../components/DrawingBoard";

const GameLobbyPage = ({
  username,
  setUsername,
  gameLobbyID,
  setGameLobbyID,
  client,
}) => {
  // state
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [usersInRoom, setUsersInRoom] = useState([{ name: username }]); // initialized value so page doesn't crash

  // // get and update players in a room
  // useEffect(() => {
  //   // if not used, won't sync chat messages properly for all players in room
  //   socket.emit("GET_USERS_IN_ROOM", { username, roomID: gameLobbyID });
  //   console.log("request for updated list of users in room");
  //   console.log(`${usersInRoom.length} current users in room:`);
  //   console.log(usersInRoom);
  // }, []);

  // useEffect(() => {
  //   socket.on("USERS_IN_ROOM_UPDATED", (usersInRoomFromServer) => {
  //     setUsersInRoom(usersInRoomFromServer);
  //     console.log("retrieved updated list of users in room");
  //     console.log(`${usersInRoom.length} current users in room:`);
  //     console.log(usersInRoom);
  //   });
  // });

  // // get user messages and game announcements
  // useEffect(() => {
  //   socket.on("MESSAGE_SENT", (messageContent) => {
  //     setMessageList([...messageList, messageContent]);
  //   });

  //   socket.on("GAME_ANNOUNCEMENT", (messageContent) => {
  //     setMessageList([...messageList, messageContent]);
  //   });

  //   // has memory leak problem related to async issues i think
  //   socket.on("ROOM_LEFT", () => {
  //     history.push("/");
  //     // hacky fix that resolves client issue of keeping old username and lobbyID if socket is manually disconnected and reconnected
  //     // if socket is disconnected and reconnected manually, client will create increment the number of times socket events are emitted (via the previous disconnected "ghost" username) each time the user clicks the "leave button" function and attempts to create a game
  //     window.location.reload(false); // force refresh the page
  //   });

  //   // test
  //   console.log(
  //     "listening for user messages, game announcements, and if the user has left the room"
  //   );
  // });

  return (
    <Container fluid="xl" className="container container--gameLobbyPage">
      <Row className="d-flex flex-column">
        <h1 className="col col-lg-12 mb-4 text-center">
          Guess My Sketch - Lobby ID&nbsp;
          <span className="text-primary">{gameLobbyID}</span>
        </h1>
      </Row>
      <TopMenuBar socket="ass" username={username} gameLobbyID={gameLobbyID} />
      <Row className="justify-content-between mb-4">
        <Col lg={3} className="d-flex flex-column justify-content-between">
          <ListGroup>
            <RoomUsersDisplay usersInRoom={usersInRoom} maxUsersShown={5} />
          </ListGroup>
        </Col>
        <Col lg={6}>
          <DrawingBoard
            socket="ass"
            username={username}
            gameLobbyID={gameLobbyID}
          />
        </Col>
        <Col lg={3} className="chat-container-wrapper">
          <TextChat
            socket="ass"
            username={username}
            gameLobbyID={gameLobbyID}
            messageList={messageList}
            setMessageList={setMessageList}
            message={message}
            setMessage={setMessage}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default GameLobbyPage;
