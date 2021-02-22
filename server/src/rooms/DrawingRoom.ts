import { Room, Client } from "colyseus";
import { DrawingRoomState } from "./schema/DrawingRoomState";

//
// CUSTOM MESSAGE TYPES
//

// TODO - put them into a separate js file
const SEND_MESSAGE = "SEND_MESSAGE";
const MESSAGE_SENT = "MESSAGE_SENT";
const SEND_DRAWING = "SEND_DRAWING";
const DRAWING_SENT = "DRAWING_SENT";

// bot variables
const BOT_NAME = "GMS Bot";

export class DrawingRoom extends Room {
  // this room supports only 16 clients connected
  maxClients = 32;

  onCreate (options: any) {
    // boilerplate code below
    //
    // this.setState(new DrawingRoomState());

    // this.onMessage("type", (client, message) => {
    //   //
    //   // handle "type" message
    //   //
    // });

    console.log(`DrawingRoom "${this.roomId}" created!`);

    this.onMessage(SEND_MESSAGE, (client, message) => {
      let messageContent = {
        // TODO: add custom property "displayName" to client?
        senderName: "",
        senderID: client.sessionId,
        messageText: message
      };

      this.broadcast(MESSAGE_SENT, messageContent);

      console.log(`Client "${client.sessionId}" in the DrawingRoom "${this.roomId}" sent the chat message "${message}".`);
    });
  }

  onJoin (client: Client, options: any) {
    let messageContent = {
      // TODO: add custom property "displayName" to client?
      senderName: BOT_NAME,
      senderID: this.roomId,
      messageText: `${client.sessionId} joined the room.`
    };

    this.broadcast(MESSAGE_SENT, messageContent);

    console.log(`Client "${client.sessionId}" joined the DrawingRoom "${this.roomId}",`);
  }

  onLeave (client: Client, consented: boolean) {
    let messageContent = {
      // TODO: add custom property "displayName" to client?
      senderName: BOT_NAME,
      senderID: this.roomId,
      messageText: `${client.sessionId} left the room.`
    };

    this.broadcast(MESSAGE_SENT, messageContent);

    console.log(`Client "${client.sessionId}" left the DrawingRoom "${this.roomId}",`);
  }

  onDispose() {
    console.log(`DrawingRoom "${this.roomId}" deleted!`);
  }

}
