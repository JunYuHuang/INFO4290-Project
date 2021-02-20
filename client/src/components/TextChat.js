import React, { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

const TextChat = ({
  socket,
  username,
  gameLobbyID,
  messageList,
  setMessageList,
  message,
  setMessage,
}) => {
  // refs
  const chatBoxContainerEnd = useRef(null);

  // for auto-scroll to bottom of chat
  useEffect(() => {
    scrollChatToBottom();
  }, [messageList]);

  const scrollChatToBottom = () => {
    chatBoxContainerEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const messageSenderFormatter = (lobbyMessage) => {
    // TODO: rework this to check userID (make App or this page to store userID)
    // or make socket server require unique username strings
    if (lobbyMessage.username === username) {
      return `You (${username}): `;
    } else if (lobbyMessage.username === "GMS Bot") {
      return "📢 ";
    } else {
      return `${lobbyMessage.username}: `;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // only send message if it's not blank
    if (message !== "") {
      let messageContent = {
        username: username,
        messageString: message,
        roomID: gameLobbyID,
      };

      await socket.emit("SEND_MESSAGE", messageContent);
      setMessageList([...messageList, messageContent]);
      setMessage("");
    }
  };

  return (
    <div className="bg-white border border-white rounded-lg">
      <ul className="chat-container">
        {messageList.map((lobbyMessage, index) => {
          return (
            <li
              id={`Message#${index}`}
              key={index}
              className="chat-container__message"
            >
              <span className="font-weight-bold">
                {messageSenderFormatter(lobbyMessage)}
              </span>
              {lobbyMessage.messageString}
            </li>
          );
        })}
        {/* dummy div for auto-scrolling down the chat as new messages come */}
        <div ref={chatBoxContainerEnd} />
      </ul>
      <Form onSubmit={(e) => handleSendMessage(e)}>
        <Form.Group controlId="formUserChatInput" className="form--chat mb-0">
          <Form.Label className="text-secondary hidden-label">
            Type your guess
          </Form.Label>
          <Form.Control
            className="form--chat__text-input border-dark"
            size="md"
            type="text"
            placeholder="[Enter] to message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default TextChat;
