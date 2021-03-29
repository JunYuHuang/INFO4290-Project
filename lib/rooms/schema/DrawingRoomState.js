"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingRoomState = void 0;
const schema_1 = require("@colyseus/schema");
const User_1 = require("./User");
const DrawingDatum_1 = require("./DrawingDatum");
const Game_1 = require("./Game");
const faker = require("faker");
class DrawingRoomState extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.users = new schema_1.MapSchema();
        this.drawingData = new schema_1.ArraySchema();
        this.game = new Game_1.Game();
        this.roomOwnerID = "";
    }
    getRoomOwnerID() {
        return this.roomOwnerID;
    }
    setRoomOwnerID(userID) {
        this.roomOwnerID = userID;
    }
    //
    // User helper methods
    //
    addUser(sessionID) {
        this.users.set(sessionID, new User_1.User());
    }
    getUser(sessionID) {
        return this.users.get(sessionID);
    }
    getAllUsers() {
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
    countUsers() {
        return this.users.size;
    }
    removeUser(sessionID) {
        this.users.delete(sessionID);
    }
    //
    // DrawingDatum helper methods
    //
    appendDrawingDatum(drawerID, color, lineWidth, startX, startY, endX, endY) {
        this.drawingData.push(new DrawingDatum_1.DrawingDatum(drawerID, color, lineWidth, startX, startY, endX, endY));
    }
    getDrawingData() {
        let drawingDataArray = [];
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
    }
    ;
    startTurn() {
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
        }
        else {
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
__decorate([
    schema_1.type({ map: User_1.User })
], DrawingRoomState.prototype, "users", void 0);
__decorate([
    schema_1.type([DrawingDatum_1.DrawingDatum])
], DrawingRoomState.prototype, "drawingData", void 0);
__decorate([
    schema_1.type(Game_1.Game)
], DrawingRoomState.prototype, "game", void 0);
__decorate([
    schema_1.type("string")
], DrawingRoomState.prototype, "roomOwnerID", void 0);
exports.DrawingRoomState = DrawingRoomState;
