import { SetSchema, ArraySchema, Schema, type } from "@colyseus/schema";

export class Game extends Schema {
  @type("boolean")
  private isActive: boolean = false;

  @type("string")
  private drawerID: string = "";

  @type("number")
  private maxRounds: number = 2;

  @type("number")
  private round: number = 1;

  @type("string")
  private secretWord: string = "";

  @type({ set: "string"})
  private previousSecretWords = new SetSchema<string>();

  @type(["string"])
  private drawingVirgins = new ArraySchema<string>();

  @type("number")
  private maxTurnTime: number = 60;

  @type("number")
  private turnTimer: number = 0;

  @type("boolean")
  private turnInProgress: boolean = false;

  @type({ set: "string"})
  private guessedRightVirgins = new SetSchema<string>();

  @type("boolean")
  private gameStarted: boolean = false;

  constructor() { 
    super();
  };

  getIsActive() {
    return this.isActive;
  }

  setIsActive(isActive: boolean) {
    this.isActive = isActive;
  }

  toggleIsActive() {
    this.isActive = !this.isActive;
  }

  getDrawerID() {
    return this.drawerID;
  }

  setDrawerID(drawerID: string) {
    this.drawerID = drawerID;
  }

  getMaxRounds() {
    return this.maxRounds;
  }

  setMaxRounds(maxRounds: number) {
    this.maxRounds = maxRounds;
  }

  getRound() {
    return this.round;
  }

  setRound(round: number) {
    this.round = round;
  }

  incrementRound() {
    this.round += 1;
  }

  getSecretWord() {
    return this.secretWord;
  }

  setSecretWord(secretWord: string) {
    this.secretWord = secretWord;
  }

  getPreviousSecretWords() {
    return this.previousSecretWords;
  }

  emptyPreviousSecretWords() {
    this.previousSecretWords.forEach((word) => {
      this.previousSecretWords.delete(word);
    });
  }

  addWordToPreviousSecretWords(word: string) {
    this.previousSecretWords.add(word);
  }

  isUniqueSecretWord(word: string) {
    return !(this.previousSecretWords.has(word));
  }

  countDrawingVirgins(): number {
    return this.drawingVirgins.length;
  }

  addDrawingVirgin(userID: string) {
    this.drawingVirgins.push(userID);
  }

  removeDrawingVirgin(userID: string) {
    const userIDIndex = this.drawingVirgins.findIndex((drawingVirginID) => drawingVirginID === userID);

    if (userIDIndex !== -1) {
      this.drawingVirgins.splice(userIDIndex, 1);
    }
  }

  emptyDrawingVirgins() {
    this.drawingVirgins.length = 0;
  }

  isDrawingVirginsEmpty() {
    return ((this.drawingVirgins.length === 0)? true : false);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getRandomDrawingVirginID() {
    // only works if there is at least 1+ userIDs in the drawingVirgins array
    if (this.countDrawingVirgins() >= 1) {
      let randomUserID = this.getRandomInt(this.countDrawingVirgins());
      return this.drawingVirgins[randomUserID];
    } else {
      return null;
    }
  }

  getTurnTimer() {
    return this.turnTimer;
  }

  setTurnTimer(seconds: number) {
    this.turnTimer = seconds;
  }

  countdownTurnTimer() {
    if (this.turnTimer > 0) {
      this.turnTimer -= 1;
    }
  }

  getMaxTurnTime() {
    return this.maxTurnTime;
  }

  setMaxTurnTime(seconds: number) {
    this.maxTurnTime = seconds;
  }

  getTurnInProgress() {
    return this.turnInProgress;
  }

  setTurnInProgress(turnInProgress: boolean) {
    this.turnInProgress = turnInProgress;
  }

  countGuessedRightVirgins(): number {
    return this.guessedRightVirgins.size;
  }

  addGuessedRightVirgin(userID: string) {
    this.guessedRightVirgins.add(userID);
  }

  removeGuessedRightVirgin(userID: string) {
    this.guessedRightVirgins.delete(userID);
  }

  emptyGuessedRightVirgins() {
    this.guessedRightVirgins.forEach((virginID) => {
      this.guessedRightVirgins.delete(virginID);
    });
  }

  isGuessedRightVirginsEmpty() {
    return((this.guessedRightVirgins.size === 0)? true : false);
  }

  getGameStarted() {
    return this.gameStarted;
  }

  setGameStarted(bool: boolean) {
    this.gameStarted = bool;
  }
}