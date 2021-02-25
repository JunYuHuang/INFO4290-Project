import { MapSchema, Schema, type } from "@colyseus/schema";
import { User } from "./User";

export class DrawingRoomState extends Schema {
  @type({ map: User})
  users = new MapSchema<User>();

  addUser(sessionID: string) {
    this.users.set(sessionID, new User());
  }

  getUser(sessionID: string): User {
    return this.users.get(sessionID);
  }

  removeUser(sessionID: string) {
    this.users.delete(sessionID);
  }
}