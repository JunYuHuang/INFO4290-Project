import { Schema, type } from "@colyseus/schema";

export class DrawingRoomState extends Schema {

  @type("string")
  mySynchronizedProperty: string = "Hello world";

}