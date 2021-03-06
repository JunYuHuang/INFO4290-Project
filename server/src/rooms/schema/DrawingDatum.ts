import { Schema, type } from "@colyseus/schema";

export class DrawingDatum extends Schema {
  @type("string")
  private drawerID: string = "";

  @type("string")
  private color: string = "";

  @type("number")
  private lineWidth: number;

  @type("number")
  private startX: number;

  @type("number")
  private startY: number;

  @type("number")
  private endX: number;

  @type("number")
  private endY: number;

  constructor(drawerID: string, color: string, lineWidth: number, startX: number, startY: number, endX: number, endY: number) { 
    super();
    this.drawerID = drawerID;
    this.color = color;
    this.lineWidth = lineWidth;
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  };

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