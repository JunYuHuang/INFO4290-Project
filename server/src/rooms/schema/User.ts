import { Schema, type } from "@colyseus/schema";

export class User extends Schema {
  private sessionID: string = "";

  private displayName: string = "";

  @type("number")
  private points: number = 0;

  @type("boolean")
  private isDrawer: boolean = false;

  constructor(sessionID?: string, displayName?: string, points?: number, isDrawer?: boolean) {
    super();
    this.sessionID = sessionID;
    this.displayName = displayName;
    this.points = points;
    this.isDrawer = isDrawer;
  }

  getSessionID() {
    return this.sessionID;
  }

  setSessionID(sessionID: string) {
    this.sessionID = sessionID;
  }

  getDisplayName() {
    return this.displayName;
  }

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  getPoints() {
    return this.points;
  }

  setPoints(points: number) {
    return this.points;
  }

  getIsDrawer() {
    return this.isDrawer;
  }

  setIsDrawer(isDrawer: boolean) {
    this.isDrawer = isDrawer;
  }
}