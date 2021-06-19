"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const schema_1 = require("@colyseus/schema");
class Game extends schema_1.Schema {
    constructor() {
        super();
        this.isActive = false;
        this.drawerID = "";
        this.maxRounds = 2;
        this.round = 1;
        this.secretWord = "";
        this.previousSecretWords = new schema_1.SetSchema();
        this.drawingVirgins = new schema_1.ArraySchema();
        this.maxTurnTime = 60;
        this.turnTimer = 0;
        this.turnInProgress = false;
        this.guessedRightVirgins = new schema_1.SetSchema();
        this.gameStarted = false;
    }
    ;
    getIsActive() {
        return this.isActive;
    }
    setIsActive(isActive) {
        this.isActive = isActive;
    }
    toggleIsActive() {
        this.isActive = !this.isActive;
    }
    getDrawerID() {
        return this.drawerID;
    }
    setDrawerID(drawerID) {
        this.drawerID = drawerID;
    }
    getMaxRounds() {
        return this.maxRounds;
    }
    setMaxRounds(maxRounds) {
        this.maxRounds = maxRounds;
    }
    getRound() {
        return this.round;
    }
    setRound(round) {
        this.round = round;
    }
    incrementRound() {
        this.round += 1;
    }
    getSecretWord() {
        return this.secretWord;
    }
    setSecretWord(secretWord) {
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
    addWordToPreviousSecretWords(word) {
        this.previousSecretWords.add(word);
    }
    isUniqueSecretWord(word) {
        return !(this.previousSecretWords.has(word));
    }
    countDrawingVirgins() {
        return this.drawingVirgins.length;
    }
    addDrawingVirgin(userID) {
        this.drawingVirgins.push(userID);
    }
    removeDrawingVirgin(userID) {
        const userIDIndex = this.drawingVirgins.findIndex((drawingVirginID) => drawingVirginID === userID);
        if (userIDIndex !== -1) {
            this.drawingVirgins.splice(userIDIndex, 1);
        }
    }
    emptyDrawingVirgins() {
        this.drawingVirgins.length = 0;
    }
    isDrawingVirginsEmpty() {
        return ((this.drawingVirgins.length === 0) ? true : false);
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    getRandomDrawingVirginID() {
        // only works if there is at least 1+ userIDs in the drawingVirgins array
        if (this.countDrawingVirgins() >= 1) {
            let randomUserID = this.getRandomInt(this.countDrawingVirgins());
            return this.drawingVirgins[randomUserID];
        }
        else {
            return null;
        }
    }
    getTurnTimer() {
        return this.turnTimer;
    }
    setTurnTimer(seconds) {
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
    setMaxTurnTime(seconds) {
        this.maxTurnTime = seconds;
    }
    getTurnInProgress() {
        return this.turnInProgress;
    }
    setTurnInProgress(turnInProgress) {
        this.turnInProgress = turnInProgress;
    }
    countGuessedRightVirgins() {
        return this.guessedRightVirgins.size;
    }
    addGuessedRightVirgin(userID) {
        this.guessedRightVirgins.add(userID);
    }
    removeGuessedRightVirgin(userID) {
        this.guessedRightVirgins.delete(userID);
    }
    emptyGuessedRightVirgins() {
        this.guessedRightVirgins.forEach((virginID) => {
            this.guessedRightVirgins.delete(virginID);
        });
    }
    isGuessedRightVirginsEmpty() {
        return ((this.guessedRightVirgins.size === 0) ? true : false);
    }
    getGameStarted() {
        return this.gameStarted;
    }
    setGameStarted(bool) {
        this.gameStarted = bool;
    }
}
__decorate([
    schema_1.type("boolean")
], Game.prototype, "isActive", void 0);
__decorate([
    schema_1.type("string")
], Game.prototype, "drawerID", void 0);
__decorate([
    schema_1.type("number")
], Game.prototype, "maxRounds", void 0);
__decorate([
    schema_1.type("number")
], Game.prototype, "round", void 0);
__decorate([
    schema_1.type("string")
], Game.prototype, "secretWord", void 0);
__decorate([
    schema_1.type({ set: "string" })
], Game.prototype, "previousSecretWords", void 0);
__decorate([
    schema_1.type(["string"])
], Game.prototype, "drawingVirgins", void 0);
__decorate([
    schema_1.type("number")
], Game.prototype, "maxTurnTime", void 0);
__decorate([
    schema_1.type("number")
], Game.prototype, "turnTimer", void 0);
__decorate([
    schema_1.type("boolean")
], Game.prototype, "turnInProgress", void 0);
__decorate([
    schema_1.type({ set: "string" })
], Game.prototype, "guessedRightVirgins", void 0);
__decorate([
    schema_1.type("boolean")
], Game.prototype, "gameStarted", void 0);
exports.Game = Game;
