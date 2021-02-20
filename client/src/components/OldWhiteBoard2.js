import React, { useState, useEffect, useRef } from "react";
import DrawingBoardTools from "./DrawingBoardTools";

const DrawingBoard = ({ socket, username, gameLobbyID }) => {
  // state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [drawnStrokeData, setDrawnStrokeData] = useState({
    username: username,
    roomID: gameLobbyID,
    color: brushColor,
    lineWidth: brushSize,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  //  // from RanaEmad's Board.js
  const [context2D, setContext2D] = useState({});
  const [canvasOffset, setCanvasOffset] = useState({ offsetX: 0, offsetY: 0 });
  const [targetposition, setTargetPosition] = useState({
    targetPositionX: 0,
    targetPositionY: 0,
  });

  // refs
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);
  const contextRef = useRef(null);

  // useEffects
  useEffect(() => {
    let canvas = canvasRef.current;
    canvas.width = canvasWrapperRef.current.offsetWidth;
    canvas.height = canvasWrapperRef.current.offsetHeight;

    let context = canvas.getContext("2d");
    context.lineJoin = "round";
    context.lineCap = "round";
    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // from RanaEmad's Board.js
    setContext2D(context);

    let offset = canvas.getBoundingClientRect();
    setCanvasOffset({
      offsetX: parseInt(offset.left),
      offsetY: parseInt(offset.top),
    });
  }, [context2D]);

  // renders drawing stroke for all clients (users) who are not the drawer
  useEffect(() => {
    socket.on("DRAWING_SENT", (drawingData) => {
      let {
        username,
        color,
        lineWidth,
        startX,
        startY,
        endX,
        endY,
      } = drawingData;
      renderDrawnStroke(color, lineWidth, startX, startY, endX, endY);
      console.log(`received a drawn stroke from user "${username}"`);
      console.log(drawingData);
    });
  });

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

  const updateContext2DSettings = () => {
    // update 2d context drawing settings
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineWidth = brushSize;
  };

  // for everyone in the room (but the drawer) to see the drawing
  const renderDrawnStroke = ({
    color,
    lineWidth,
    startX,
    startY,
    endX,
    endY,
  }) => {
    let canvas = canvasRef.current;
    canvas.width = canvasWrapperRef.current.offsetWidth;
    canvas.height = canvasWrapperRef.current.offsetHeight;

    let context = canvas.getContext("2d");
    context.lineJoin = "round";
    context.lineCap = "round";

    setContext2D(context);

    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = lineWidth;
    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    contextRef.current.lineTo(endX, endY);
    contextRef.current.stroke();
    contextRef.current.closePath();
  };

  // event handlers

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    updateContext2DSettings();

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    setDrawnStrokeData({
      ...drawnStrokeData,
      startX: offsetX,
      startY: offsetY,
      color: brushColor,
      lineWidth: brushSize,
    });
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);

    // send the drawn stroke to the server
    socket.emit("SEND_DRAWING", drawnStrokeData);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    updateContext2DSettings();

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    setDrawnStrokeData({
      ...drawnStrokeData,
      endX: offsetX,
      endY: offsetY,
      color: brushColor,
      lineWidth: brushSize,
    });
  };

  const handleClearDrawingBoard = (e) => {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  return (
    <div className="drawing-canvas-wrapper bg-white" ref={canvasWrapperRef}>
      <canvas
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
      ></canvas>
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

// export default DrawingBoard;
