import React, { useState, useEffect, useRef } from "react";
import DrawingBoardTools from "./DrawingBoardTools";

const DrawingBoard = ({ user, clientRoom }) => {
  // state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [brushStrokeData, setBrushStrokeData] = useState([
    // {
    //   drawerID: user.sessionID,
    //   color: brushColor,
    //   lineWidth: brushSize,
    //   startX: 0,
    //   startY: 0,
    //   endX: 1,
    //   endY: 1,
    // },
  ]);

  // refs
  const canvasWrapperRef = useRef(null); // for setting up initial canvas w * h
  const canvasRef = useRef(null); // for setting up initial canvas w * h
  const contextRef = useRef(null); // for drawing on the canvas
  const startPointRef = useRef(null);
  const endPointRef = useRef(null);

  // useEffects

  useEffect(() => {
    // initialize 2d canvas settings
    let canvas = canvasRef.current;
    canvas.width = canvasWrapperRef.current.offsetWidth;
    canvas.height = canvasWrapperRef.current.offsetHeight;
    let context = canvas.getContext("2d");
    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    startPointRef.current = {
      X: 0,
      Y: 0,
    };
    endPointRef.current = {
      X: 0,
      Y: 0,
    };

    // listen for socket "DRAWING_SENT" events
    clientRoom.onMessage("DRAWING_SENT", (brushStrokeData) => {
      // // scale the stroke depending on the user's canvas size
      // let { startX, startY, endX, endY } = drawingData;
      // let w = canvasRef.current.width;
      // let h = canvasRef.current.height;

      // updateDrawing(
      //   {
      // ...drawingData,
      // startX: startX * w,
      // startY: startY * h,
      // endX: endX * w,
      // endY: endY * h,
      //   },
      //   // false
      // );

      let w = canvasRef.current.width;
      let h = canvasRef.current.height;

      brushStrokeData.forEach((brushStrokeDatum) => {
        let { startX, startY, endX, endY } = brushStrokeDatum;

        updateDrawing({
          ...brushStrokeDatum,
          startX: startX * w,
          startY: startY * h,
          endX: endX * w,
          endY: endY * h,
        });
      });
    });

    // listen for socket "DRAWING_BOARD_CLEARED" events
    clientRoom.onMessage("DRAWING_BOARD_CLEARED", () => {
      clearCanvas(false);
    });
  }, []);

  // helper functions

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

  const sendDrawingToServer = () => {
    clientRoom.send("SEND_DRAWING", brushStrokeData);
  };

  const updateDrawing = (drawingData) => {
    let { color, lineWidth, startX, startY, endX, endY } = drawingData;

    // render the drawing strokes locally
    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    contextRef.current.lineTo(endX, endY);
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.stroke();
    contextRef.current.closePath();

    // prevents users from infinitely sending updates to server
    // if (!shouldUpdateServer) return;

    // scale the stroke depending on the user's canvas size
    let w = canvasRef.current.width;
    let h = canvasRef.current.height;

    // save the drawing data to the local state
    setBrushStrokeData((previousBrushStrokeData) => {
      return [
        ...previousBrushStrokeData,
        {
          ...drawingData,
          startX: startX / w,
          startY: startY / h,
          endX: endX / w,
          endY: endY / h,
        },
      ];
    });

    // clientRoom.send("SEND_DRAWING", {
    //   ...drawingData,
    // startX: startX / w,
    // startY: startY / h,
    // endX: endX / w,
    // endY: endY / h,
    // });
  };

  const clearCanvas = (shouldUpdateServer) => {
    setBrushStrokeData([]);

    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // prevents users from infinitely sending updates to server
    if (!shouldUpdateServer) return;

    clientRoom.send("CLEAR_DRAWING_BOARD");
  };

  // event handlers

  const startDrawing = ({ nativeEvent }) => {
    setIsDrawing(true);
    // update the starting point of the stroke
    const { offsetX, offsetY } = nativeEvent;
    startPointRef.current.X = offsetX;
    startPointRef.current.Y = offsetY;

    let drawingData = {
      drawerID: user.sessionID,
      color: brushColor,
      lineWidth: brushSize,
      startX: offsetX,
      startY: offsetY,
      endX: offsetX,
      endY: offsetY,
    };

    updateDrawing(drawingData);
  };

  const finishDrawing = ({ nativeEvent }) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // update the starting point of the stroke
    const { offsetX, offsetY } = nativeEvent;
    let drawingData = {
      drawerID: user.sessionID,
      color: brushColor,
      lineWidth: brushSize,
      startX: startPointRef.current.X,
      startY: startPointRef.current.Y,
      endX: offsetX,
      endY: offsetY,
    };
    // updateDrawing(drawingData, true);
    updateDrawing(drawingData);
    sendDrawingToServer();
    setBrushStrokeData([]);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;

    let drawingData = {
      drawerID: user.sessionID,
      color: brushColor,
      lineWidth: brushSize,
      startX: startPointRef.current.X,
      startY: startPointRef.current.Y,
      endX: offsetX,
      endY: offsetY,
    };
    // updateDrawing(drawingData, true);
    updateDrawing(drawingData);

    // set the new starting point
    startPointRef.current.X = offsetX;
    startPointRef.current.Y = offsetY;
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
        handleClearDrawingBoard={(e) => clearCanvas(true)}
      />
    </div>
  );
};

export default DrawingBoard;
