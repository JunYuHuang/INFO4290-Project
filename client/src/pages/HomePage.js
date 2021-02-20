import { Container, Form, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const HomePage = (props) => {
  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Container className="form-container form-container--homePage">
      <Form className="form form--homePage" onSubmit={handleSubmit}>
        <h1 className="font-weight-hold text-center mb-4">Guess My Sketch</h1>
        <Form.Group>
          <LinkContainer to="/createGameLobby">
            <Button variant="outline-primary" className="btn-lg btn-block">
              Create a Lobby
            </Button>
          </LinkContainer>
        </Form.Group>
        <Form.Group>
          <LinkContainer to="/joinGameLobby">
            <Button variant="primary" className="btn-lg btn-block">
              Join a Lobby
            </Button>
          </LinkContainer>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default HomePage;
