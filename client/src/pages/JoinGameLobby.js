import { Container, Form, Button } from "react-bootstrap";
import history from "../history";

const JoinGamePage = ({
  username,
  setUsername,
  gameLobbyID,
  setGameLobbyID,
  socket,
}) => {
  const handleSubmit = (e) => {
    // fill form -> press submit -> socket.io creates user -> socket.io joins user to room -> callback to client (via custom socket event) -> redirect to gamelobby page
    e.preventDefault();

    // socket.emit("CREATE_USER", username);

    // socket.on("USER_CREATED", () => {
    //   // testing
    //   console.log(`Submitted Username: ${username}`);
    //   console.log(`Submitted Lobby ID: ${gameLobbyID}`);

    //   socket.emit("JOIN_ROOM", { username, roomID: gameLobbyID });
    // });

    // socket.on("ROOM_JOINED", () => {
    //   history.push("/gameLobby");
    // });
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
        <Form.Group controlId="formLobbyId">
          <Form.Label className="text-secondary">Game Lobby ID</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter game lobby ID"
            required
            onChange={(e) => setGameLobbyID(e.target.value)}
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

export default JoinGamePage;
