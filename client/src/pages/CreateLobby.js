import { Container, Form, Button } from "react-bootstrap";
import history from "../history";

const CreateLobby = ({ user, setUser, setClientRoom, client }) => {
  const createAndJoinRoom = async () => {
    try {
      // request the server to create a room
      const room = await client.create("drawingRoom");
      console.log(`Created and joined room "${room.id}" successfully.`);

      // save the local state
      setUser({ ...user, sessionID: room.sessionId, lobbyID: room.id });
      setClientRoom(room);

      // redirect to GameLobbyPage
      history.push("/gameLobby");
    } catch (error) {
      console.log(`Failed to create and join a room: ${error}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAndJoinRoom();
  };

  return (
    <Container className="form-container form-container--homePage">
      <Form className="form form--homePage" onSubmit={(e) => handleSubmit(e)}>
        <h1 className="font-weight-hold text-center mb-4">Guess My Sketch</h1>
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
        <Form.Group>
          <Button
            variant="primary"
            className="btn-lg btn-block mt-4"
            type="submit"
          >
            Create Lobby
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default CreateLobby;
