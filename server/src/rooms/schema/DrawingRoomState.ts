import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { User } from "./User";
import { DrawingDatum } from "./DrawingDatum";

export class DrawingRoomState extends Schema {
  @type({ map: User })
  users = new MapSchema<User>();

  @type([DrawingDatum])
  drawingData = new ArraySchema<DrawingDatum>();

  // User helper methods

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
  
  // DrawingDatum helper methods

  appendDrawingDatum(drawerID: string, color: string, lineWidth: number, startX: number, startY: number, endX: number, endY: number) {
    this.drawingData.push(new DrawingDatum(drawerID, color, lineWidth, startX, startY, endX, endY));
  }

  getDrawingData(): Object[] {
    let drawingDataArray: Object[] = [];

    this.drawingData.forEach((drawingDatum) => {
      drawingDataArray.push({
        drawerID: drawingDatum.getDrawerID(),
        color: drawingDatum.getColor(),
        lineWidth: drawingDatum.getLineWidth(),
        startX: drawingDatum.getStartX(),
        startY: drawingDatum.getStartY(),
        endX: drawingDatum.getEndX(),
        endY: drawingDatum.getEndY()
      });
    });

    return drawingDataArray;
  }

  clearDrawingData() {
    this.drawingData.length = 0;
  }
}