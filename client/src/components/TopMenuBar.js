import { Row, Col, Button } from "react-bootstrap";
import history from "../history";

const TopMenuBar = ({ client, username, gameLobbyID }) => {
  // TODO - complete leave room functionality with room.leave()
  const leaveRoom = async () => {
    try {
      // leave a room
      // const room = await client.joinById(gameLobbyID);
      console.log(`Left room "" successfully.`);
      // redirect to home page
      history.push("/");
    } catch (error) {
      console.log(`Failed to leave the room: ${error}`);
    }
  };

  const handleLeaveButton = () => {
    // leaveRoom();
  };

  return (
    <Row className="my-3">
      <Col lg={3}></Col>
      <Col
        lg={6}
        className="d-flex flex-row justify-content-between align-items-center"
      >
        {/* <div className="menuItem menuItem--rounds">
          <div className="menuItem--rounds__description font-weight-normal">
            Round
          </div>
          <div className="menuItem--rounds__numbers">2 / 3</div>
        </div>
        <div className="menuItem menuItem--wordToGuess">_ _ _ G O N</div>
        <div className="menuItem menuItem--timeLeft d-flex flex-row justify-content-end text-align-right">
          <div className="menuItem--timeLeft__wrapper">
            <i className="las la-stopwatch"></i>
            <span className="menuItem--timeLeft__numbers">38</span>
          </div>
        </div> */}
      </Col>
      <Col
        lg={3}
        className="d-flex flex-row justify-content-end align-items-center buttonContainer buttonContainer--topMenBar"
      >
        {/* <Button
          variant="primary"
          className="btn mr-3"
          // onClick={() => handleStartGameButton()}
        >
          Start
        </Button> */}
        <Button
          variant="danger"
          className="btn"
          onClick={() => handleLeaveButton()}
        >
          Leave
        </Button>
      </Col>
    </Row>
  );
};

export default TopMenuBar;
