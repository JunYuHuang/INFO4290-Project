import { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAuth } from "../lib/auth";
import AuthModalShell from "../components/AuthModalShell";
import history from "../history";

const Home = ({ user, setUser, setClientRoom, client, faker }) => {
  const [alertVisibility, setAlertVisibility] = useState(false);

  const flashAlert = () => {
    setAlertVisibility(true);
    setTimeout(() => {
      setAlertVisibility(false);
    }, 3000);
  };

  const [modalVisibility, setModalVisibility] = useState(false);

  const auth = useAuth();
  const [authModalLabel, setAuthModalLabel] = useState("");
  const [authModalCallback, setAuthModalCallback] = useState(null);
  const [authModalVisibility, setAuthModalVisibility] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setUser({ ...user, displayName: auth.user.username });
    } else {
      setUser({ ...user, displayName: "" });
    }
  }, [auth.user]);

  const generateRandomDisplayName = () => {
    return faker.fake("{{commerce.color}}-{{commerce.product}}").toLowerCase();
  };

  const joinRoom = async () => {
    try {
      // join a room
      const room = await client.joinById(user.lobbyID);
      console.log(`Created and joined room "${room.id}" successfully.`);

      console.log(auth.user);
      // save the local state
      if (user.displayName === "") {
        setUser({
          ...user,
          displayName: auth.user
            ? auth.user.username
            : generateRandomDisplayName(),
          sessionID: room.sessionId,
          lobbyID: room.id,
        });
      } else {
        setUser({ ...user, sessionID: room.sessionId, lobbyID: room.id });
      }
      setClientRoom(room);

      // close the modal
      setModalVisibility(false);

      // redirect to lobby
      history.push("/lobby");
    } catch (error) {
      console.log(`Failed to join the room: ${error}`);
      flashAlert();
    }
  };

  const createAndJoinRoom = async () => {
    try {
      // request the server to create a room
      const room = await client.create("drawingRoom");
      console.log(`Created and joined room "${room.id}" successfully.`);

      // save the local state
      if (user.displayName === "") {
        setUser({
          ...user,
          displayName: auth.user
            ? auth.user.username
            : generateRandomDisplayName(),
          sessionID: room.sessionId,
          lobbyID: room.id,
        });
      } else {
        setUser({ ...user, sessionID: room.sessionId, lobbyID: room.id });
      }
      setClientRoom(room);

      // redirect to Lobby
      history.push("/lobby");
    } catch (error) {
      console.log(`Failed to create and join a room: ${error}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const setLoginModal = () => {
    setAuthModalCallback(() => async (username, password) => {
      await auth.login(username, password);
      setAuthModalVisibility(false);
    });
    setAuthModalLabel("Login");
    setAuthModalVisibility(true);
  };

  const setSignupModal = () => {
    setAuthModalCallback(() => async (username, password) => {
      await auth.signup(username, password);
      setAuthModalVisibility(false);
    });
    setAuthModalLabel("Sign Up");
    setAuthModalVisibility(true);
  };

  return (
    <Container className="form-container form-container--homePage">
      <Form className="form form--homePage" onSubmit={handleSubmit}>
        <h1 className="lobby-title text-center mb-4">Guess My Sketch</h1>
        <Form.Group controlId="formUsername">
          <Form.Label className="text-secondary">Your Name</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Enter your name"
            required
            readOnly={auth.user ? true : false}
            value={user.displayName}
            onChange={(e) => setUser({ ...user, displayName: e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Button
            variant="outline-primary"
            className="btn-lg btn-block"
            onClick={() => setModalVisibility(true)}
          >
            Join a Lobby
          </Button>
        </Form.Group>
        <Form.Group>
          <Button
            variant="primary"
            className="btn-lg btn-block"
            onClick={() => createAndJoinRoom()}
          >
            Create a Lobby
          </Button>
        </Form.Group>
        {/* modal */}
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={modalVisibility}
          onHide={() => setModalVisibility(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Join a Lobby</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* alert */}
            <Alert show={alertVisibility} variant="danger">
              <strong>Failed to join lobby {user.lobbyID}</strong>
            </Alert>
            {/* alert */}
            <Form.Group controlId="formLobbyId">
              <Form.Label className="text-secondary">Game Lobby ID</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Enter game lobby ID"
                required
                value={user.lobbyID}
                onChange={(e) => setUser({ ...user, lobbyID: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setModalVisibility(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={() => joinRoom()}>
              Join Lobby
            </Button>
          </Modal.Footer>
        </Modal>
        {/* modal */}
        {auth.user && (
          <>
            <p className="lobby-auth-welcome text-center">
              Welcome back, {auth.user.username}
            </p>
            <Button
              variant="outline-danger"
              className="btn-lg btn-block"
              onClick={() => auth.signout()}
            >
              Sign Out
            </Button>
          </>
        )}
        {!auth.user && (
          <div className="auth-button-wrapper">
            <Button
              className="auth-button"
              variant="outline-primary"
              onClick={() => setSignupModal(true)}
            >
              Sign Up
            </Button>
            <Button
              className="auth-button ml-3"
              variant="outline-primary"
              onClick={() => setLoginModal(true)}
            >
              Login
            </Button>
          </div>
        )}
        <AuthModalShell
          label={authModalLabel}
          visible={authModalVisibility}
          onSubmit={async (username, password) =>
            await authModalCallback(username, password)
          }
          onCancel={() => setAuthModalVisibility(false)}
        />
      </Form>
    </Container>
  );
};

export default Home;
