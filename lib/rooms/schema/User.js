"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const schema_1 = require("@colyseus/schema");
class User extends schema_1.Schema {
    constructor() {
        super();
        this.displayName = "";
        this.points = 0;
        this.isDrawer = false;
        this.isAuthenticated = false;
        this.guessedRight = false;
    }
    ;
    getDisplayName() {
        return this.displayName;
    }
    setDisplayName(displayName) {
        this.displayName = displayName;
    }
    getPoints() {
        return this.points;
    }
    setPoints(points) {
        this.points = points;
    }
    addPoints(points) {
        this.points += points;
    }
    getIsDrawer() {
        return this.isDrawer;
    }
    setIsDrawer(isDrawer) {
        this.isDrawer = isDrawer;
    }
    getIsAuthenticated() {
        return this.isAuthenticated;
    }
    setIsAuthenticated(isAuthenticated) {
        this.isAuthenticated = isAuthenticated;
    }
    getGuessedRight() {
        return this.guessedRight;
    }
    setGuessedRight(guessedRight) {
        this.guessedRight = guessedRight;
    }
}
__decorate([
    schema_1.type("string")
], User.prototype, "displayName", void 0);
__decorate([
    schema_1.type("number")
], User.prototype, "points", void 0);
__decorate([
    schema_1.type("boolean")
], User.prototype, "isDrawer", void 0);
__decorate([
    schema_1.type("boolean")
], User.prototype, "isAuthenticated", void 0);
__decorate([
    schema_1.type("boolean")
], User.prototype, "guessedRight", void 0);
exports.User = User;
