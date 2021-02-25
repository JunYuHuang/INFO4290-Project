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
const BOT_NAME = "Server Bot";

export class DrawingRoom extends Room {
  // this room supports only 16 clients connected
  maxClients = 16;

  onCreate (options: any) {
    // boilerplate code below
    //
    // this.setState(new DrawingRoomState());

    console.log(`DrawingRoom "${this.roomId}" created!`);

    this.onMessage(SEND_MESSAGE, (client, messagePackage) => {
      let { senderID, senderDisplayName, messageText } = messagePackage;
      this.broadcast(MESSAGE_SENT, messagePackage);
      console.log(`Client "${client.sessionId}" (${senderDisplayName}) in the DrawingRoom "${this.roomId}" sent the chat message "${messageText}".`);
    });
  }

  onJoin (client: Client, options: any) {
    let messagePackage = {
      senderID: this.roomId,
      senderDisplayName: BOT_NAME,
      messageText: `${client.sessionId} joined the room.`
    };

    this.broadcast(MESSAGE_SENT, messagePackage);

    console.log(`Client "${client.sessionId}" joined the DrawingRoom "${this.roomId}".`);
  }

  onLeave (client: Client, consented: boolean) {
    let messagePackage = {
      senderDisplayName: BOT_NAME,
      senderID: this.roomId,
      messageText: `${client.sessionId} left the room.`
    };

    this.broadcast(MESSAGE_SENT, messagePackage);

    console.log(`Client "${client.sessionId}" left the DrawingRoom "${this.roomId}".`);
  }

  onDispose() {
    console.log(`DrawingRoom "${this.roomId}" deleted!`);
  }

}
