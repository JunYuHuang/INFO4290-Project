import React, { useEffect, useRef } from "react";
import { Form } from "react-bootstrap";

const TextChat = ({ user, clientRoom, messageList, message, setMessage }) => {
  // bot variables
  const BOT_ID = user.lobbyID;

  // refs
  const chatBoxContainerEnd = useRef(null);

  // for auto-scroll to bottom of chat
  useEffect(() => {
    scrollChatToBottom();
  }, [messageList]);

  const scrollChatToBottom = () => {
    chatBoxContainerEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const messageSenderFormatter = (messagePackage) => {
    if (messagePackage.senderID === user.sessionID) {
      return `You (${messagePackage.senderDisplayName}): `;
    } else if (messagePackage.senderID === BOT_ID) {
      return "📢 ";
    } else {
      return `${messagePackage.senderDisplayName}: `;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    // only send message if it's not blank
    if (message !== "") {
      let messagePackage = {
        senderID: user.sessionID,
        senderDisplayName: user.displayName,
        messageText: message,
      };

      clientRoom.send("SEND_MESSAGE", messagePackage);
      setMessage("");
    }
  };

  return (
    <div className="bg-white border border-white rounded-lg">
      <ul className="chat-container">
        {messageList.map((messagePackage, index) => {
          return (
            <li
              id={`Message#${index}`}
              key={index}
              className="chat-container__message"
            >
              <span className="font-weight-bold">
                {messageSenderFormatter(messagePackage)}
              </span>
              {messagePackage.messageText}
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
