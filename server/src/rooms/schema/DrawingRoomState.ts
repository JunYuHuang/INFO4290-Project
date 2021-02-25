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

  getAllUsers(): Object[] {
    let usersArray = Array.from(this.users, ([key, value]) => ({
      sessionID: key,
      displayName: value.getDisplayName(),
      points: value.getPoints(),
      isDrawer: value.getIsDrawer()
    }));

    return usersArray;
  }

  removeUser(sessionID: string) {
    this.users.delete(sessionID);
  }
}