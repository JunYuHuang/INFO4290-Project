import { Container, Form, Button } from "react-bootstrap";
import history from "../history";

const CreateLobbyPage = ({ username, setUsername, setGameLobbyID, socket }) => {
  const handleSubmit = (e) => {
    // fill form -> press submit -> socket.io creates user -> socket.io creates room and joins user to it -> callback to client (via custom socket event) -> redirect to gamelobby page
    e.preventDefault();

    // setGameLobbyID(roomID);
    // history.push("/gameLobby");
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
            onChange={(e) => setUsername(e.target.value)}
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

export default CreateLobbyPage;
