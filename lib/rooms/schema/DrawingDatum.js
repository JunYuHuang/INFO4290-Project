"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawingDatum = void 0;
const schema_1 = require("@colyseus/schema");
class DrawingDatum extends schema_1.Schema {
    constructor(drawerID, color, lineWidth, startX, startY, endX, endY) {
        super();
        this.drawerID = "";
        this.color = "";
        this.drawerID = drawerID;
        this.color = color;
        this.lineWidth = lineWidth;
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
    ;
    getDrawerID() {
        return this.drawerID;
    }
    getColor() {
        return this.color;
    }
    getLineWidth() {
        return this.lineWidth;
    }
    getStartX() {
        return this.startX;
    }
    getStartY() {
        return this.startY;
    }
    getEndX() {
        return this.endX;
    }
    getEndY() {
        return this.endY;
    }
}
__decorate([
    schema_1.type("string")
], DrawingDatum.prototype, "drawerID", void 0);
__decorate([
    schema_1.type("string")
], DrawingDatum.prototype, "color", void 0);
__decorate([
    schema_1.type("number")
], DrawingDatum.prototype, "lineWidth", void 0);
__decorate([
    schema_1.type("number")
], DrawingDatum.prototype, "startX", void 0);
__decorate([
    schema_1.type("number")
], DrawingDatum.prototype, "startY", void 0);
__decorate([
    schema_1.type("number")
], DrawingDatum.prototype, "endX", void 0);
__decorate([
    schema_1.type("number")
], DrawingDatum.prototype, "endY", void 0);
exports.DrawingDatum = DrawingDatum;
