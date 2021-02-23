import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import history from "../history";

const JoinLobby = ({ user, setUser, setClientRoom, client }) => {
  const [alertVisibility, setAlertVisibility] = useState(false);

  const flashAlert = () => {
    setAlertVisibility(true);
    setTimeout(() => {
      setAlertVisibility(false);
    }, 5000);
  };

  const joinRoom = async () => {
    try {
      // join a room
      const room = await client.joinById(user.lobbyID);
      console.log(`Created and joined room "${room.id}" successfully.`);

      // save the local state
      setUser({ ...user, sessionID: room.sessionId, lobbyID: room.id });
      setClientRoom(room);

      // redirect to GameLobbyPage
      history.push("/gameLobby");
    } catch (error) {
      console.log(`Failed to join the room: ${error}`);
      flashAlert();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    joinRoom();
  };

  return (
    <Container className="form-container form-container--homePage">
      <Form className="form form--homePage" onSubmit={(e) => handleSubmit(e)}>
        <h1 className="font-weight-hold text-center mb-4">Guess My Sketch</h1>
        {/* alert */}
        <Alert show={alertVisibility} variant="danger">
          <strong>Failed to join lobby {user.lobbyID}</strong>
        </Alert>
        {/* alert */}
        <Form.Group controlId="formUsername">
          <Form.Label className="text-secondary">Your Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter your name"
            required
            onChange={(e) => setUser({ ...user, displayName: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="formLobbyId">
          <Form.Label className="text-secondary">Game Lobby ID</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter game lobby ID"
            required
            onChange={(e) => setUser({ ...user, lobbyID: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Button
            variant="primary"
            className="btn-lg btn-block mt-5"
            type="submit"
          >
            Join Lobby
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default JoinLobby;
