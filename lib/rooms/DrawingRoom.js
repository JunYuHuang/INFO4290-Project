"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingRoom = void 0;
const colyseus_1 = require("colyseus");
const DrawingRoomState_1 = require("./schema/DrawingRoomState");
//
// CUSTOM MESSAGE TYPES
//
// TODO - put them into a separate js file
const SEND_MESSAGE = "SEND_MESSAGE";
const MESSAGE_SENT = "MESSAGE_SENT";
const ADD_USER = "ADD_USER";
const USER_ADDED = "USER_ADDED";
const SEND_DRAWING = "SEND_DRAWING";
const DRAWING_SENT = "DRAWING_SENT";
const CLEAR_DRAWING_BOARD = "CLEAR_DRAWING_BOARD";
const DRAWING_BOARD_CLEARED = "DRAWING_BOARD_CLEARED";
const GET_USERS_IN_ROOM = "GET_USERS_IN_ROOM";
const USERS_IN_ROOM_UPDATED = "USERS_IN_ROOM_UPDATED";
const WORD_PROMPT_SENT = "WORD_PROMPT_SENT";
const ROUND_INFO_SENT = "ROUND_INFO_SENT";
const START_GAME = "START_GAME";
const TURN_TIME_UPDATED = "TURN_TIME_UPDATED";
const GAME_STARTED = "GAME_STARTED";
// bot variables
const BOT_NAME = "Server Bot";
class DrawingRoom extends colyseus_1.Room {
    constructor() {
        // 
        // CUSTOM METHODS
        //
        super(...arguments);
        //
        // ROOM LIFECYCLE METHODS
        //
        // this room supports only 16 clients connected
        this.maxClients = 16;
    }
    getClient(sessionID) {
        let foundClient;
        this.clients.forEach((client) => {
            if (client.sessionId === sessionID) {
                foundClient = client;
            }
        });
        return foundClient;
    }
    // source: https://stackoverflow.com/questions/1789945/how-to-check-whether-a-string-contains-a-substring-in-javascript
    kmpSearch(pattern, text) {
        if (pattern.length == 0)
            return 0; // Immediate match
        // Compute longest suffix-prefix table
        var lsp = [0]; // Base case
        for (var i = 1; i < pattern.length; i++) {
            var j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
            while (j > 0 && pattern.charAt(i) != pattern.charAt(j))
                j = lsp[j - 1];
            if (pattern.charAt(i) == pattern.charAt(j))
                j++;
            lsp.push(j);
        }
        // Walk through text string
        var j = 0; // Number of chars matched in pattern
        for (var i = 0; i < text.length; i++) {
            while (j > 0 && text.charAt(i) != pattern.charAt(j))
                j = lsp[j - 1]; // Fall back in the pattern
            if (text.charAt(i) == pattern.charAt(j)) {
                j++; // Next char matched, increment position
                if (j == pattern.length)
                    return i - (j - 1);
            }
        }
        return -1; // Not found
    }
    containsPattern(pattern, text) {
        let found = false;
        let kmpSearchResult = this.kmpSearch(pattern, text);
        if (kmpSearchResult !== -1) {
            found = true;
        }
        return found;
    }
    checkGuess(guess) {
        let correct = false;
        if (guess === this.state.game.getSecretWord()) {
            correct = true;
        }
        return correct;
    }
    addPointsToDrawer(userID) {
        // calculate points base on % of nondrawer players that guessed correctly during the turn
        let totalGuessers = this.state.countUsers() - 1;
        let usersThatGuessedCorrectly = totalGuessers - this.state.game.countGuessedRightVirgins();
        let points = Math.round(300 * (usersThatGuessedCorrectly / totalGuessers));
        // DEBUG
        console.log();
        this.state.getUser(userID).addPoints(points);
    }
    addPointsToNonDrawer(userID) {
        let guessedAtTime = this.state.game.getTurnTimer();
        let maxTime = this.state.game.getMaxTurnTime();
        let twoThirdsTimeLeft = this.state.game.getMaxTurnTime() * 2 / 3;
        let oneThirdTimeLeft = this.state.game.getMaxTurnTime() / 3;
        let points = 0;
        if (guessedAtTime <= maxTime && guessedAtTime >= twoThirdsTimeLeft) {
            points = 300;
        }
        else if (guessedAtTime <= twoThirdsTimeLeft && guessedAtTime >= oneThirdTimeLeft) {
            points = 200;
        }
        else if (guessedAtTime <= oneThirdTimeLeft && guessedAtTime >= 0) {
            points = 100;
        }
        else {
            // should be impossible case
        }
        this.state.getUser(userID).addPoints(points);
    }
    resetAllUserScores() {
        this.state.users.forEach((value, key) => {
            value.setPoints(0);
        });
    }
    removeAllWhitespace(text) {
        return text.replace(/\s/g, "");
    }
    syncClientsUsersState() {
        // update all clients
        let updatedLobbyUsers = this.state.getAllUsers();
        this.broadcast(USERS_IN_ROOM_UPDATED, updatedLobbyUsers);
    }
    syncClientsWordPromptState() {
        this.broadcast(WORD_PROMPT_SENT, this.state.game.getSecretWord());
    }
    syncClientsRoundInfoState() {
        this.broadcast(ROUND_INFO_SENT, {
            round: this.state.game.getRound(),
            maxRounds: this.state.game.getMaxRounds()
        });
    }
    syncClientsTurnTimerState() {
        this.broadcast(TURN_TIME_UPDATED, this.state.game.getTurnTimer());
    }
    syncClientsGameStatusState(bool) {
        this.broadcast(GAME_STARTED, bool);
    }
    onCreate(options) {
        // initialize state
        this.setState(new DrawingRoomState_1.DrawingRoomState());
        console.log(`DrawingRoom "${this.roomId}" created!`);
        // process chat messages sent by room clients
        this.onMessage(SEND_MESSAGE, (client, messagePackage) => {
            let { senderID, senderDisplayName, messageText } = messagePackage;
            // if a turn is in progress, check if the user's guess matches the secret word
            let cleanedUserGuess = this.removeAllWhitespace(messageText).toLowerCase();
            let turnInProgress = this.state.game.getTurnInProgress();
            let senderIsDrawer = (client.sessionId === this.state.game.getDrawerID() ? true : false);
            let guessContainsWord = this.containsPattern(this.state.game.getSecretWord(), cleanedUserGuess);
            let guessMatchesWord = this.checkGuess(cleanedUserGuess);
            let userGuessedRightAlready = this.state.getUser(client.sessionId).getGuessedRight();
            // debug
            console.log("=== Chat Message Evaluation ===");
            console.log(`cleanedUserGuess: "${cleanedUserGuess}"`);
            console.log(`turnInProgress? ${turnInProgress}`);
            console.log(`senderIsDrawer? ${senderIsDrawer}`);
            console.log(`guessContainsWord? ${guessContainsWord}`);
            console.log(`guessMatchesWord? ${guessMatchesWord}`);
            console.log(`userGuessedRightAlready? ${userGuessedRightAlready}`);
            console.log("===============================");
            if (turnInProgress && !senderIsDrawer) {
                // evaluate or forward messages sent by non-drawing users
                if (!userGuessedRightAlready && guessMatchesWord) {
                    // update game state (mark flag and add points to the user)
                    this.state.getUser(client.sessionId).setGuessedRight(true);
                    this.state.game.removeGuessedRightVirgin(client.sessionId);
                    console.log(`guessedRightVirgins: ${this.state.game.countGuessedRightVirgins()}`);
                    this.addPointsToNonDrawer(client.sessionId);
                    this.syncClientsUsersState();
                    // this.syncClientsTurnTimerState();
                    // broadcast announcement
                    this.broadcast(MESSAGE_SENT, {
                        senderDisplayName: BOT_NAME,
                        senderID: this.roomId,
                        messageText: `${this.state.getUser(client.sessionId).getDisplayName()} guessed the word!`
                    }, {
                        except: client
                    });
                    client.send(MESSAGE_SENT, {
                        senderDisplayName: BOT_NAME,
                        senderID: this.roomId,
                        messageText: "You guessed the word!"
                    });
                }
                else if (!guessContainsWord) {
                    // forward message sent by non-drawer if message doesn't contain secret word
                    this.broadcast(MESSAGE_SENT, messagePackage);
                }
            }
            else if (!turnInProgress) {
                // game is not active; forward any user sent message
                this.broadcast(MESSAGE_SENT, messagePackage);
            }
            else {
                console.log("The drawer sent a message during their turn or something else went wrong :(");
            }
            console.log(`Client "${client.sessionId}" (${senderDisplayName}) in the DrawingRoom "${this.roomId}" sent the chat message "${messageText}".`);
        });
        // forward drawing data to other clients
        this.onMessage(SEND_DRAWING, (client, brushStrokeData) => {
            // only send drawing if user is drawer and their turn is in progress
            let senderIsDrawer = (client.sessionId === this.state.game.getDrawerID() ? true : false);
            let turnInProgress = this.state.game.getTurnInProgress();
            if (senderIsDrawer && turnInProgress) {
                brushStrokeData.forEach((brushStrokeDatum) => {
                    let { drawerID, color, lineWidth, startX, startY, endX, endY } = brushStrokeDatum;
                    this.state.appendDrawingDatum(drawerID, color, lineWidth, startX, startY, endX, endY);
                });
                this.broadcast(DRAWING_SENT, this.state.getDrawingData(), { except: client });
                console.log(`User "${client.sessionId}" (${this.state.getUser(client.sessionId).getDisplayName()}) sent some drawing data to the room "${this.roomId}".`);
            }
        });
        // clear the drawing board
        this.onMessage(CLEAR_DRAWING_BOARD, (client, message) => {
            // only clear drawing if user is drawer and their turn is in progress
            let senderIsDrawer = (client.sessionId === this.state.game.getDrawerID() ? true : false);
            let turnInProgress = this.state.game.getTurnInProgress();
            if (senderIsDrawer && turnInProgress) {
                this.state.clearDrawingData();
                this.broadcast(DRAWING_BOARD_CLEARED, message, { except: client });
                console.log(`User "${client.sessionId}" (${this.state.getUser(client.sessionId).getDisplayName()}) cleared the drawing board in the room "${this.roomId}".`);
            }
        });
        // start the game if the user is the room owner
        this.onMessage(START_GAME, (client, userID) => {
            let turnInProgress = this.state.game.getTurnInProgress();
            let gameIsActive = this.state.game.getIsActive();
            let isRoomOwner = (this.state.getRoomOwnerID() === client.sessionId ? true : false);
            let enoughPlayers = (this.state.countUsers() >= 2 ? true : false);
            let gameStarted = this.state.game.getGameStarted();
            if (isRoomOwner && (!turnInProgress) && (!gameIsActive) && enoughPlayers && (!gameStarted)) {
                this.broadcast(MESSAGE_SENT, {
                    senderDisplayName: BOT_NAME,
                    senderID: this.roomId,
                    messageText: "Starting soon!"
                });
                // temp way of starting game
                this.syncClientsGameStatusState(true);
                // give some delay before starting turn
                this.state.game.setGameStarted(true);
                this.clock.setTimeout(() => {
                    this.resetAllUserScores();
                    this.state.game.setRound(1);
                    this.state.cleanRound();
                    this.state.game.setIsActive(true);
                    let maxTurnTime = this.state.game.getMaxTurnTime();
                    this.state.game.setTurnTimer(maxTurnTime);
                    this.state.game.setTurnInProgress(this.state.startTurn());
                }, 3000);
            }
            else {
                // tell the client why the game failed to start via a chat message
                let failReason = "";
                if (turnInProgress || gameIsActive || gameStarted) {
                    failReason = "Game is in progress!";
                }
                else if (!isRoomOwner) {
                    // only occurs if the non-drawing user somehow accesses the start button on the client
                    failReason = "You are not the room owner!";
                }
                else if (!enoughPlayers) {
                    failReason = "Need at least 2 players to start!";
                }
                else {
                    failReason = "Something went wrong :(";
                }
                client.send(MESSAGE_SENT, {
                    senderDisplayName: BOT_NAME,
                    senderID: this.roomId,
                    messageText: `Failed to start game: ${failReason}`
                });
            }
        });
        // game loop that updates every second
        this.setSimulationInterval(() => {
            let currentTurnTime = this.state.game.getTurnTimer();
            let turnStartTime = this.state.game.getMaxTurnTime();
            let gameIsActive = this.state.game.getIsActive();
            if (gameIsActive) {
                if (currentTurnTime > 0) {
                    // turn is in progress??
                    if (currentTurnTime === turnStartTime) {
                        // clean up drawingBoard
                        this.state.clearDrawingData();
                        this.broadcast(DRAWING_BOARD_CLEARED, "");
                        // turn started
                        if (this.state.game.getTurnInProgress()) {
                            let drawerClient = this.getClient(this.state.game.getDrawerID());
                            // broadcast to non-drawing users in the room
                            this.broadcast(MESSAGE_SENT, {
                                senderID: this.roomId,
                                senderDisplayName: BOT_NAME,
                                messageText: `${this.state.getUser(this.state.game.getDrawerID()).getDisplayName()} is drawing!`
                            }, { except: drawerClient });
                            // message the secret word to the drawer
                            drawerClient.send(MESSAGE_SENT, {
                                senderID: this.roomId,
                                senderDisplayName: BOT_NAME,
                                messageText: `You are drawing the word "${this.state.game.getSecretWord()}"!`
                            });
                            this.syncClientsUsersState();
                            this.syncClientsWordPromptState();
                            this.syncClientsRoundInfoState();
                        }
                        console.log(`> Turn started? ${this.state.game.getTurnInProgress()}`);
                    }
                    else {
                        // turn is in progress
                        // TODO - end turn prematurely if all non-drawing users guessed the word correctly
                        if (this.state.game.isGuessedRightVirginsEmpty()) {
                            this.state.game.setTurnInProgress(false);
                            this.state.game.setTurnTimer(0);
                        }
                    }
                    // advance timer only if turn actually started
                    if (this.state.game.getTurnInProgress() === true) {
                        this.state.game.countdownTurnTimer();
                        this.syncClientsTurnTimerState();
                    }
                    if (this.state.countUsers() < 2) {
                        // end the game prematurely
                        this.state.game.setGameStarted(false);
                        this.state.game.setIsActive(false);
                        this.state.game.setTurnInProgress(false);
                        this.state.game.emptyPreviousSecretWords();
                        this.state.game.setTurnTimer(0);
                        this.syncClientsTurnTimerState();
                        this.syncClientsRoundInfoState();
                        this.syncClientsWordPromptState();
                        // broadcast message
                        this.broadcast(MESSAGE_SENT, {
                            senderID: this.roomId,
                            senderDisplayName: BOT_NAME,
                            messageText: "Game is over!"
                        });
                        console.log("> Game is over!");
                    }
                }
                else if (currentTurnTime === 0 && this.state.game.getGameStarted()) {
                    // award points to the drawer
                    this.addPointsToDrawer(this.state.game.getDrawerID());
                    // turn ended
                    this.state.game.setTurnInProgress(false);
                    console.log("> Turn ended.");
                    // send chat message
                    let turnSummaryMessage = (this.state.game.isGuessedRightVirginsEmpty() ? "Everyone guessed the word!" : "Time is up!");
                    this.broadcast(MESSAGE_SENT, {
                        senderID: this.roomId,
                        senderDisplayName: BOT_NAME,
                        messageText: `${turnSummaryMessage} The word was "${this.state.game.getSecretWord().toUpperCase()}".`
                    });
                    this.state.cleanTurn();
                    // send server state updates to client
                    this.syncClientsUsersState();
                    this.syncClientsWordPromptState();
                    this.syncClientsRoundInfoState();
                    this.syncClientsTurnTimerState();
                    // start new turn or new round or end game
                    // check if everyone has drawn this round
                    if (this.state.game.isDrawingVirginsEmpty()) {
                        // start a new round or end the game
                        let shouldStartNewRound = ((this.state.game.getRound() < this.state.game.getMaxRounds()) ? true : false);
                        let shouldEndGame = ((this.state.game.getRound() === this.state.game.getMaxRounds()) ? true : false);
                        if (shouldStartNewRound) {
                            this.state.cleanRound();
                            this.state.game.incrementRound();
                            // temp way of starting new turn
                            this.state.game.setIsActive(true);
                            let maxTurnTime = this.state.game.getMaxTurnTime();
                            this.state.game.setTurnTimer(maxTurnTime);
                            this.state.game.setTurnInProgress(this.state.startTurn());
                        }
                        else if (shouldEndGame) {
                            this.state.game.setGameStarted(false);
                            this.state.game.setIsActive(false);
                            this.state.game.emptyPreviousSecretWords();
                            // broadcast message
                            this.broadcast(MESSAGE_SENT, {
                                senderID: this.roomId,
                                senderDisplayName: BOT_NAME,
                                messageText: "Game is over!"
                            });
                            console.log("> Game is over!");
                            return;
                        }
                        else {
                            // should be impossible case (round should never be > maxRounds)
                            console.log("> Failed to start new round or end game!");
                        }
                    }
                    else {
                        // start another turn in the current round
                        // temp way of starting new turn
                        this.state.game.setIsActive(true);
                        let maxTurnTime = this.state.game.getMaxTurnTime();
                        this.state.game.setTurnTimer(maxTurnTime);
                        this.state.game.setTurnInProgress(this.state.startTurn());
                    }
                }
                else {
                    // console.log("Game not started!");
                }
                console.log(`Timer: ${currentTurnTime}s left`);
            }
            else {
                // game is over or has not started
                this.state.game.setTurnTimer(0);
            }
        }, 1000);
    }
    onAuth(client, options, request) {
        var _a, _b;
        const session = request.session;
        console.log(request.session);
        if (((_a = session.passport) === null || _a === void 0 ? void 0 : _a.user) != null)
            return {
                isAuth: true,
                user: (_b = session.passport) === null || _b === void 0 ? void 0 : _b.user
            };
        return {
            isAuth: false,
            user: null
        };
    }
    onJoin(client, options, auth) {
        // add the player to the room state
        this.state.addUser(client.sessionId);
        // add the user to the drawingVirgins array (to track players who have not drawn in a round yet)
        this.state.game.addDrawingVirgin(client.sessionId);
        console.log(`drawingVirgins: ${this.state.game.countDrawingVirgins()}`);
        // add the user to the guessedRightVirgins
        this.state.game.addGuessedRightVirgin(client.sessionId);
        console.log(`guessedRightVirgins: ${this.state.game.countGuessedRightVirgins()}`);
        // add additional user info to the state
        this.onMessage(ADD_USER, (client, userInfo) => {
            let { displayName } = userInfo;
            if (auth.isAuth) {
                this.state.getUser(client.sessionId).setIsAuthenticated(true);
                this.state.getUser(client.sessionId).setDisplayName(auth.user.username);
            }
            else {
                this.state.getUser(client.sessionId).setDisplayName(displayName);
            }
            // make the player the room owner if they are the first to join the room
            let shouldBeRoomOwner = (this.state.countUsers() === 1 ? true : false);
            if (shouldBeRoomOwner) {
                this.state.setRoomOwnerID(client.sessionId);
            }
            // announce to all clients in the room that a player has joined
            let messagePackage = {
                senderID: this.roomId,
                senderDisplayName: BOT_NAME,
                messageText: `${this.state.getUser(client.sessionId).getDisplayName()} joined the room.`
            };
            this.broadcast(MESSAGE_SENT, messagePackage);
            // send new list of users to client
            this.syncClientsUsersState();
            let shouldSyncGameInfo = (this.state.game.getTurnInProgress() ? true : false);
            if (shouldSyncGameInfo) {
                this.syncClientsRoundInfoState();
                this.syncClientsWordPromptState();
            }
            // send the current Canvas drawing to the client
            client.send(DRAWING_SENT, this.state.getDrawingData());
        });
        console.log(`Client "${client.sessionId}" joined the DrawingRoom "${this.roomId}".`);
    }
    onLeave(client, consented) {
        // announce to all clients in the room that a player has left
        let messagePackage = {
            senderDisplayName: BOT_NAME,
            senderID: this.roomId,
            messageText: `${this.state.getUser(client.sessionId).getDisplayName()} left the room.`
        };
        this.broadcast(MESSAGE_SENT, messagePackage);
        // remove the player's info to the room state
        this.state.removeUser(client.sessionId);
        // remove the user from the drawingVirgins array (to track players who have not drawn in a round yet)
        this.state.game.removeDrawingVirgin(client.sessionId);
        console.log(`drawingVirgins: ${this.state.game.countDrawingVirgins()}`);
        // remove the user from the guessedRightVirgins
        this.state.game.removeGuessedRightVirgin(client.sessionId);
        console.log(`guessedRightVirgins: ${this.state.game.countGuessedRightVirgins()}`);
        // send new list of users to client
        this.syncClientsUsersState();
        console.log(`Client "${client.sessionId}" left the DrawingRoom "${this.roomId}".`);
    }
    onDispose() {
        console.log(`DrawingRoom "${this.roomId}" deleted!`);
    }
}
exports.DrawingRoom = DrawingRoom;
