import { Room, Client } from "colyseus";
import { DrawingRoomState } from "./schema/DrawingRoomState";

//
// CUSTOM MESSAGE TYPES
//

// TODO - put them into a separate js file
const SEND_MESSAGE = "SEND_MESSAGE";
const MESSAGE_SENT = "MESSAGE_SENT";
const ADD_USER = "ADD_USER";
const USER_ADDED = "USER_ADDED";
const JOIN_ROOM = "JOIN_ROOM";
const ROOM_JOINED = "ROOM_JOINED";
const DELETE_USER = "DELETE_USER";
const USER_DELETED = "USER_DELETED";
const SEND_DRAWING = "SEND_DRAWING";
const DRAWING_SENT = "DRAWING_SENT";
const GET_USERS_IN_ROOM = "GET_USERS_IN_ROOM";
const USERS_IN_ROOM_UPDATED = "USERS_IN_ROOM_UPDATED";

// bot variables
const BOT_NAME = "Server Bot";

export class DrawingRoom extends Room<DrawingRoomState> {
  //
  // CUSTOMER HELPER METHODS
  //

  //
  // ROOM LIFECYCLE METHODS
  //

  // this room supports only 16 clients connected
  maxClients = 16;

  onCreate (options: any) {
    // initialize state
    this.setState(new DrawingRoomState());
    console.log(`DrawingRoom "${this.roomId}" created!`);

    // broadcast messages sent by each client in the room
    this.onMessage(SEND_MESSAGE, (client, messagePackage) => {
      let { senderID, senderDisplayName, messageText } = messagePackage;
      this.broadcast(MESSAGE_SENT, messagePackage);
      console.log(`Client "${client.sessionId}" (${senderDisplayName}) in the DrawingRoom "${this.roomId}" sent the chat message "${messageText}".`);
    });
    
    // TODO: send new list of users to client
    // code
  }

  onJoin (client: Client, options: any) {
    // add the player to the room state
    this.state.addUser(client.sessionId);

    // add additional user info to the state
    this.onMessage(ADD_USER, (client, userInfo) => {
      let { sessionID, displayName } = userInfo;
      // this.state.getUser(client.sessionId).setSessionID(sessionID);
      this.state.getUser(client.sessionId).setDisplayName(displayName);

      // announce to all clients in the room that a player has joined
      let messagePackage = {
        senderID: this.roomId,
        senderDisplayName: BOT_NAME,
        messageText: `${this.state.getUser(client.sessionId).getDisplayName()} joined the room.`
      };
      this.broadcast(MESSAGE_SENT, messagePackage);

      // TODO: send new list of users to client
      let updatedLobbyUsers = this.state.getAllUsers();
      this.broadcast(USERS_IN_ROOM_UPDATED, updatedLobbyUsers);
    });

    console.log(`Client "${client.sessionId}" joined the DrawingRoom "${this.roomId}".`);
  }

  onLeave (client: Client, consented: boolean) {
    // announce to all clients in the room that a player has left
    let messagePackage = {
      senderDisplayName: BOT_NAME,
      senderID: this.roomId,
      messageText: `${this.state.getUser(client.sessionId).getDisplayName()} left the room.`
    };
    this.broadcast(MESSAGE_SENT, messagePackage);

    // remove the player's info to the room state
    this.state.removeUser(client.sessionId);

    // TODO: send new list of users to client
    let updatedLobbyUsers = this.state.getAllUsers();
    this.broadcast(USERS_IN_ROOM_UPDATED, updatedLobbyUsers);

    console.log(`Client "${client.sessionId}" left the DrawingRoom "${this.roomId}".`);
  }

  onDispose() {
    console.log(`DrawingRoom "${this.roomId}" deleted!`);
  }

}
