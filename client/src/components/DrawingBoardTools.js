// import React, { useState, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { CirclePicker } from "react-color";

const DrawingBoardTools = ({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  handleClearDrawingBoard,
}) => {
  // constants
  const BLACK = "#000000";
  const WHITE = "#FFFFFF";

  return (
    <Form className="drawing-canvas-tools d-flex flex-row justify-content-between align-items-center">
      <CirclePicker
        className="colorPicker"
        width="260px"
        color={brushColor}
        circleSpacing={14}
        colors={[
          "#000000",
          "#4d2719",
          "#b80000",
          "#FCCB00",
          "#008b02",
          "#004dcf",
        ]}
        onChangeComplete={(color) => {
          setBrushColor(color.hex);
        }}
      />
      <Form.Group
        className="d-flex flex-column justify-content-center mb-0"
        controlId="formBrushSize"
      >
        <Form.Label className="hidden-label">Brush Size</Form.Label>
        <Form.Control
          custom
          className="input--range--brush-size"
          min="1"
          max="101"
          step="1"
          onChange={(e) => {
            setBrushSize(Number(e.target.value));
          }}
          type="range"
          value={brushSize}
        />
      </Form.Group>
      <div className="d-flex flex-row align-items-center button-container--drawing-tools">
        <Button
          variant="secondary"
          className="btn mr-3"
          onClick={() => {
            setBrushColor(BLACK);
          }}
        >
          {/* select brush / pen button */}
          <i className="las la-2x la-pen"></i>
        </Button>
        <Button
          variant="secondary"
          className="btn mr-3"
          onClick={() => {
            setBrushColor(WHITE);
          }}
        >
          {/* select eraser button */}
          <i className="las la-2x la-eraser"></i>
        </Button>
        <Button
          variant="secondary"
          className="btn"
          onClick={(e) => {
            handleClearDrawingBoard(e);
          }}
        >
          {/* clear canvas button */}
          <i className="las la-2x la-trash-alt"></i>
        </Button>
      </div>
    </Form>
  );
};

export default DrawingBoardTools;
