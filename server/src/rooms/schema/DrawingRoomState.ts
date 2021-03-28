import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { User } from "./User";
import { DrawingDatum } from "./DrawingDatum";
import { Game } from "./Game";
const faker = require("faker");

export class DrawingRoomState extends Schema {
  @type({ map: User })
  users = new MapSchema<User>();

  @type([DrawingDatum])
  drawingData = new ArraySchema<DrawingDatum>();

  @type(Game)
  game = new Game();

  @type("string")
  roomOwnerID: string = "";

  getRoomOwnerID() {
    return this.roomOwnerID;
  }

  setRoomOwnerID(userID: string) {
    this.roomOwnerID = userID;
  }

  //
  // User helper methods
  //

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
      isDrawer: value.getIsDrawer(),
      isAuthenticated: value.getIsAuthenticated(),
      guessedRight: value.getGuessedRight()
    }));

    return usersArray;
  }

  countUsers(): number {
    return this.users.size;
  }

  removeUser(sessionID: string) {
    this.users.delete(sessionID);
  }

  //
  // DrawingDatum helper methods
  //

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

  //
  // Game helper methods
  //

  generateSecretWord() {
    let secretWord = faker.fake("{{commerce.product}}").toLowerCase();

    do {
      secretWord = faker.fake("{{commerce.product}}").toLowerCase();
    } while (!(this.game.isUniqueSecretWord(secretWord)));

    return secretWord;
  };

  startTurn(): boolean {
    // TODO - only this to only work only if there are 2+ users in the room
    let success = false;

    if (this.users.size >= 2) {
      // debug - check previous secret words
      console.log("> Previous secret words:");
      this.game.getPreviousSecretWords().forEach((word) => {
        console.log(word);
      });
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>");

      // get and set the new drawer by ID
      let drawerID = this.game.getRandomDrawingVirginID();
      this.game.setDrawerID(drawerID);

      this.getUser(drawerID).setIsDrawer(true);
      console.log(`Client "${drawerID}" (${this.getUser(drawerID).getDisplayName()}) is drawing!`);

      // mark the drawer is having drawn this round
      this.game.removeDrawingVirgin(drawerID);
      console.log(`drawingVirgins: ${this.game.countDrawingVirgins()}`);
      this.game.removeGuessedRightVirgin(drawerID);
      console.log(`guessedRightVirgins: ${this.game.countDrawingVirgins()}`);

      // mark the drawer is having guessed the word correctly
      this.getUser(drawerID).setGuessedRight(true);

      // choose a new word
      let newSecretWord = this.generateSecretWord();
      this.game.addWordToPreviousSecretWords(newSecretWord);
      this.game.setSecretWord(newSecretWord);
      console.log(`The secret word is "${newSecretWord}"`);

      // indicate success
      success = true;
    } else { 
      // all users in the current round have drawn
      console.log("Cannot start turn in current round because all users have drawn this round!");
    }

    return success;
  }

  cleanTurn() {
    // reset "isDrawer" property of last drawing user
    this.getUser(this.game.getDrawerID()).setIsDrawer(false);

    // clear previous drawerID
    this.game.setDrawerID("");

    // clear previous secret word
    this.game.setSecretWord("");
    
    // set all users as not having guessed right
    this.users.forEach((value, key) => {
      this.getUser(key).setGuessedRight(false);
    });

    // re-add all users back to the guessedRightVirgins array
    this.game.emptyGuessedRightVirgins();
    this.users.forEach((value, key) => {
      this.game.addGuessedRightVirgin(key);
    });

    // DEBUG
    console.log(`guessedRightVirgins: ${this.game.countGuessedRightVirgins()}`);
    console.log(`drawingVirgins: ${this.game.countDrawingVirgins()}`);
  }

  cleanRound() {
    // re-add all users to the drawingVirgins array
    this.game.emptyDrawingVirgins();
    this.users.forEach((value, key) => {
      this.game.addDrawingVirgin(key);
    });
  }
}