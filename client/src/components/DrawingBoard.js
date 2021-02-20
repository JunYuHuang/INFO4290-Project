import React, { useState, useEffect, useRef } from "react";
import DrawingBoardTools from "./DrawingBoardTools";

const DrawingBoard = ({ socket, username, gameLobbyID }) => {
  // state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  // const [drawnStrokeData, setDrawnStrokeData] = useState({
  //   username: username,
  //   roomID: gameLobbyID,
  //   color: brushColor,
  //   lineWidth: brushSize,
  //   startX: 0,
  //   startY: 0,
  //   endX: 0,
  //   endY: 0,
  // });

  // refs
  const canvasWrapperRef = useRef(null); // for setting up initial canvas w * h
  const canvasRef = useRef(null); // for setting up initial canvas w * h
  const contextRef = useRef(null); // for drawing on the canvas
  const startPointRef = useRef(null);
  const endPointRef = useRef(null);

  // useEffects

  useEffect(() => {
    // // initialize 2d canvas settings
    // let canvas = canvasRef.current;
    // canvas.width = canvasWrapperRef.current.offsetWidth;
    // canvas.height = canvasWrapperRef.current.offsetHeight;
    // let context = canvas.getContext("2d");
    // context.lineJoin = "round";
    // context.lineCap = "round";
    // context.strokeStyle = brushColor;
    // context.lineWidth = brushSize;
    // contextRef.current = context;
    // startPointRef.current = {
    //   X: 0,
    //   Y: 0,
    // };
    // endPointRef.current = {
    //   X: 0,
    //   Y: 0,
    // };
    // // // handle browser resizes
    // // window.addEventListener("resize", () => {
    // //   contextRef.current.restore();
    // //   canvasRef.current.width = canvasWrapperRef.current.offsetWidth;
    // //   canvasRef.current.height = canvasWrapperRef.current.offsetHeight;
    // //   contextRef.current.save();
    // // });
    // // listen for socket "DRAWING_SENT" events
    // socket.on("DRAWING_SENT", (drawingData) => {
    //   // scale the stroke depending on the user's canvas size
    //   let { startX, startY, endX, endY } = drawingData;
    //   let w = canvasRef.current.width;
    //   let h = canvasRef.current.height;
    //   updateDrawing(
    //     {
    //       ...drawingData,
    //       startX: startX * w,
    //       startY: startY * h,
    //       endX: endX * w,
    //       endY: endY * h,
    //     },
    //     false
    //   );
    // });
    // // listen for socket "DRAWING_BOARD_CLEARED" events
    // socket.on("DRAWING_BOARD_CLEARED", () => {
    //   clearCanvas(false);
    // });
  }, []);

  // useEffect(() => {
  //   // send drawing update to server when
  //   // 1) mouse clicked and unclicked
  //   // 2) mouse clicked, moved, and unclicked

  //   // don't update server if user has only clicked mouse but is not moving it (and is still holding the click)
  //   let { EndX, EndY } = drawnStrokeData;
  //   let shouldUpdateServer = true;
  //   if (EndX === 0 || !EndY === 0) {
  //     shouldUpdateServer = false;
  //   }
  //   // draws "points" or "dots" (when user only clicks but doesn't move mouse)
  //   updateDrawing(drawnStrokeData, shouldUpdateServer);
  //   console.log("sending drawing update to server!");
  // }, [drawnStrokeData]);

  // helper functions

  const saveDrawingBoardState = () => {
    // test
    contextRef.current.save();
  };

  const restoreDrawingBoardState = () => {
    // test
    contextRef.current.restore();
  };

  const throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function () {
      const time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  const updateDrawing = (drawingData, shouldUpdateServer) => {
    let { color, lineWidth, startX, startY, endX, endY } = drawingData;

    // test
    // contextRef.current.restore();

    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    contextRef.current.lineTo(endX, endY);
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.stroke();
    contextRef.current.closePath();

    // test
    // contextRef.current.save();

    // prevents users from infinitely sending updates to server
    if (!shouldUpdateServer) return;

    // scale the stroke depending on the user's canvas size
    let w = canvasRef.current.width;
    let h = canvasRef.current.height;

    socket.emit("SEND_DRAWING", {
      ...drawingData,
      startX: startX / w,
      startY: startY / h,
      endX: endX / w,
      endY: endY / h,
    });
    // return;
  };

  const clearCanvas = (shouldUpdateServer) => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // prevents users from infinitely sending updates to server
    if (!shouldUpdateServer) return;

    socket.emit("CLEAR_DRAWING_BOARD", { username, roomID: gameLobbyID });
  };

  // event handlers

  const startDrawing = ({ nativeEvent }) => {
    setIsDrawing(true);
    // update the starting point of the stroke
    const { offsetX, offsetY } = nativeEvent;
    startPointRef.current.X = offsetX;
    startPointRef.current.Y = offsetY;
    // updateContext2DSettings();
    // contextRef.current.beginPath();
    // contextRef.current.moveTo(offsetX, offsetY);
    // setDrawnStrokeData({
    //   ...drawnStrokeData,
    //   startX: offsetX,
    //   startY: offsetY,
    //   color: brushColor,
    //   lineWidth: brushSize,
    // });
  };

  const finishDrawing = ({ nativeEvent }) => {
    // contextRef.current.closePath();
    if (!isDrawing) return;
    setIsDrawing(false);
    // update the starting point of the stroke
    const { offsetX, offsetY } = nativeEvent;
    let drawingData = {
      username: username,
      roomID: gameLobbyID,
      color: brushColor,
      lineWidth: brushSize,
      startX: startPointRef.current.X,
      startY: startPointRef.current.Y,
      endX: offsetX,
      endY: offsetY,
    };
    updateDrawing(drawingData, true);
    // setDrawnStrokeData({
    //   ...drawnStrokeData,
    //   endX: offsetX,
    //   endY: offsetY,
    // });
    // draws "points" or "dots" (when user only clicks but doesn't move mouse)
    // updateDrawing(drawnStrokeData, true);
    // // send the drawn stroke to the server
    // socket.emit("SEND_DRAWING", drawnStrokeData);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    // updateContext2DSettings();
    const { offsetX, offsetY } = nativeEvent;

    let drawingData = {
      username: username,
      roomID: gameLobbyID,
      color: brushColor,
      lineWidth: brushSize,
      startX: startPointRef.current.X,
      startY: startPointRef.current.Y,
      endX: offsetX,
      endY: offsetY,
    };
    updateDrawing(drawingData, true);

    // set the new starting point
    startPointRef.current.X = offsetX;
    startPointRef.current.Y = offsetY;
    // contextRef.current.lineTo(offsetX, offsetY);
    // contextRef.current.stroke();
    // setDrawnStrokeData({
    //   ...drawnStrokeData,
    //   endX: offsetX,
    //   endY: offsetY,
    // });
    // updateDrawing(drawnStrokeData, true);
  };

  const handleClearDrawingBoard = (e) => {
    clearCanvas(true);
  };

  return (
    <div className="drawing-canvas-wrapper bg-white" ref={canvasWrapperRef}>
      <canvas
        // width={canvasWrapperRef.current.offsetWidth || "800"}
        // height={canvasWrapperRef.current.offsetHeight || "600"}
        className="drawing-canvas bg-white border border-white rounded-lg"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseOut={finishDrawing}
        onMouseMove={throttle(draw, 10)}
        // mobile support below
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchCancel={finishDrawing}
        onTouchMove={throttle(draw, 10)}
      >
        <h1 className="text-center">Your browser doesn't support Canvas 😟</h1>
      </canvas>
      <DrawingBoardTools
        brushColor={brushColor}
        setBrushColor={setBrushColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        handleClearDrawingBoard={handleClearDrawingBoard}
      />
    </div>
  );
};

export default DrawingBoard;
