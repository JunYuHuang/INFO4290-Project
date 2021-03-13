import { useState } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";

const AuthModalShell = ({ label, visible, onCancel, onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={visible}
      onHide={() => onCancel()}
    >
      <Modal.Header closeButton>
        <Modal.Title>{label}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* alert */}
        {/* <Alert show={alertVisibility} variant="danger">
          <strong>Failed to join lobby {user.lobbyID}</strong>
        </Alert> */}
        {/* alert */}
        <Form.Group controlId="username">
          <Form.Label className="text-secondary">Username</Form.Label>
          <Form.Control
            size="lg"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="text-secondary">Password</Form.Label>
          <Form.Control
            size="lg"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onSubmit(username, password)}>
          {label}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AuthModalShell;
