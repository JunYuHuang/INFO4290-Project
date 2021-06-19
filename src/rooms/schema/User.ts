import { Schema, type } from "@colyseus/schema";

export class User extends Schema {
  @type("string")
  private displayName: string = "";

  @type("number")
  private points: number = 0;

  @type("boolean")
  private isDrawer: boolean = false;

  @type("boolean")
  private isAuthenticated: boolean = false;

  @type("boolean")
  private guessedRight: boolean = false;

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
    this.points = points;
  }

  addPoints(points: number) {
    this.points += points;
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

  getGuessedRight() {
    return this.guessedRight;
  }

  setGuessedRight(guessedRight: boolean) {
    this.guessedRight = guessedRight;
  }
}