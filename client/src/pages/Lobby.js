import { useState, useEffect } from "react";
import { Row, Col, Container, ListGroup } from "react-bootstrap";
import history from "../history";
import RoomUsersDisplay from "../components/RoomUsersDisplay";
import TopMenuBar from "../components/TopMenuBar";
import TextChat from "../components/TextChat";
import DrawingBoard from "../components/DrawingBoard";

const Lobby = ({ user, setUser, clientRoom, setClientRoom, client }) => {
  // state
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // const [usersInRoom, setUsersInRoom] = useState([{ name: user.displayName }]);

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
  }, []);

  return (
    <Container fluid="xl" className="container container--gameLobbyPage">
      <Row className="d-flex flex-column">
        <h1 className="col col-lg-12 mb-4 text-center">
          Guess My Sketch - Lobby ID&nbsp;
          <span className="text-primary">{user.lobbyID}</span>
        </h1>
      </Row>
      <TopMenuBar
        user={user}
        setUser={setUser}
        clientRoom={clientRoom}
        client={client}
      />
      <Row className="justify-content-between mb-4">
        <Col lg={3} className="d-flex flex-column justify-content-between">
          <ListGroup>
            {/* <RoomUsersDisplay usersInRoom={usersInRoom} maxUsersShown={5} /> */}
          </ListGroup>
        </Col>
        <Col lg={6}>
          {/* <DrawingBoard
            client={client}
            username={user.username}
            gameLobbyID={user.lobbyID}
          /> */}
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
