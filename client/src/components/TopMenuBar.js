import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import history from "../history";

const TopMenuBar = ({
  user,
  setUser,
  clientRoom,
  secretWord,
  setSecretWord,
  roundInfo,
  setRoundInfo,
  turnTime,
}) => {
  const handleLeaveButton = async () => {
    try {
      // leave a room
      clientRoom.leave();
      console.log(`Left room "${user.lobbyID}" successfully.`);
      setUser({ ...user, sessionID: "", isRoomOwner: false });
      setSecretWord("");
      setRoundInfo({ round: -1, maxRounds: -1 });

      // redirect to home page
      history.push("/");
    } catch (error) {
      console.log(`Failed to leave the room: ${error}`);
    }
  };

  const handleStartButton = async () => {
    try {
      clientRoom.send("START_GAME", user.sessionID);
    } catch (error) {
      console.log(`Failed to start game: ${error}`);
    }
  };

  const displayRounds = () => {
    if (roundInfo.round !== -1 && roundInfo.maxRounds !== -1) {
      return (
        <>
          <div className="menuItem--rounds__description font-weight-normal">
            Round
          </div>
          <div className="menuItem--rounds__numbers">
            {roundInfo.round} / {roundInfo.maxRounds}
          </div>
        </>
      );
    }
  };

  const displayStartButton = () => {
    if (user.isRoomOwner) {
      return (
        <Button
          variant="primary"
          className="btn mr-3"
          onClick={() => handleStartButton()}
        >
          Start
        </Button>
      );
    }
  };

  const displayWordPrompt = () => {
    if (secretWord !== "") {
      let prompt = "";

      if (user.isDrawer) {
        prompt = `Draw: ${secretWord.toUpperCase()}`;
      } else {
        for (let i = 0; i < secretWord.length; i++) {
          prompt += "_ ";
        }
      }

      return prompt;
    }
  };

  return (
    <Row className="my-3">
      <Col lg={3}></Col>
      <Col
        lg={6}
        className="d-flex flex-row justify-content-between align-items-center"
      >
        <div className="menuItem menuItem--rounds">{displayRounds()}</div>
        <div className="menuItem menuItem--wordToGuess">
          {displayWordPrompt()}
        </div>
        <div className="menuItem menuItem--timeLeft d-flex flex-row justify-content-end text-align-right">
          <div className="menuItem--timeLeft__wrapper">
            <span className="menuItem--timeLeft__numbers">{turnTime}</span>
            <i className="las la-stopwatch"></i>
          </div>
        </div>
      </Col>
      <Col
        lg={3}
        className="d-flex flex-row justify-content-end align-items-center buttonContainer buttonContainer--topMenBar"
      >
        {displayStartButton()}
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
