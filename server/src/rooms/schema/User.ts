import { Schema, type } from "@colyseus/schema";

export class User extends Schema {
  private displayName: string = "";

  @type("number")
  private points: number = 0;

  @type("boolean")
  private isDrawer: boolean = false;

  @type("boolean")
  private isAuthenticated: boolean = false;

  constructor() {
    super();
  };

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

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  setIsAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
}