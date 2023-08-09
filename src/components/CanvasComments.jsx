import * as React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const colors = ["red", "green", "yellow", "black", "blue"];

export const CanvasComments = () => {
  // HERE WE ARE TESTING
  const [file, setFile] = useState();
  function handleChange(e) {
    if (e.target.files.length > 5) {
      alert("Only 5 files accepted.");
      e.preventDefault();
      return;
    }
    console.log(`These are the files: ${e.target.files}`);
    if (e.target.files[0] !== undefined) {
      setFile(URL.createObjectURL(e.target.files[0]));
      console.log(`upload this image ${URL.createObjectURL(e.target.files[0])}`);
      autoLoadImage(URL.createObjectURL(e.target.files[0]));
    }
  }
  const autoLoadImage = (showThis) => {
    var img1 = new Image();

    //drawing of the test image - img1
    img1.onload = function () {
      var width = this.width;
      var height = this.height;
      // setImgWidth(this.width)
      // setImgHeight(this.height)
      console.log(`This is the width ${width}`);
      console.log(`This is the height ${height}`);
      //draw background image
      canvasRef.current.width = this.width;
      canvasRef.current.height = this.height;
      ctx.current.drawImage(img1, 0, 0);
    };
    img1.src = showThis;
    console.log(canvasRef.current.offsetWidth);
    console.log(canvasRef.current.width);
    console.log(canvasRef.current.offsetHeight);
    console.log(canvasRef.current.height);
  };
  // tESTING

  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [mouseDown, setMouseDown] = useState(false);
  const [lastPosition, setPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
    console.log(canvasRef.current);
  }, []);

  const draw = useCallback(
    (x, y) => {
      if (mouseDown) {
        ctx.current.beginPath();
        ctx.current.strokeStyle = selectedColor;
        ctx.current.lineWidth = 10;
        ctx.current.lineJoin = "round";
        ctx.current.moveTo(lastPosition.x, lastPosition.y);
        ctx.current.lineTo(x, y);
        ctx.current.closePath();
        ctx.current.stroke();

        setPosition({
          x,
          y,
        });
      }
    },
    [lastPosition, mouseDown, selectedColor, setPosition]
  );

  const clear = () => {
    ctx.current.clearRect(
      0,
      0,
      ctx.current.canvas.width,
      ctx.current.canvas.height
    );
    // autoLoadImage(file);
    // console.log(`Hello there: ${number}`);
  };

  const onMouseDown = (e) => {
    var cssScaleX = canvasRef.current.width / canvasRef.current.offsetWidth;
    var cssScaleY = canvasRef.current.height / canvasRef.current.offsetHeight;
    setPosition({
      x: e.pageX * cssScaleX,
      y: (e.pageY-56.32) * cssScaleY,
    });
    console.log("x: " + e.pageX * cssScaleX + " y: " + e.pageY * cssScaleY)
    console.log("x: " + e.pageX + " y: " + (e.pageY-56.32))
    setMouseDown(true);
  };

  const onMouseUp = (e) => {
    setMouseDown(false);
  };

  const onMouseMove = (e) => {
    var cssScaleX = canvasRef.current.width / canvasRef.current.offsetWidth;
    var cssScaleY = canvasRef.current.height / canvasRef.current.offsetHeight;
    draw(e.pageX * cssScaleX, (e.pageY-56.32) * cssScaleY);
  };

  return (
    <div style={{ position: "relative" }}>
    <h1 style={{margin:0}}>Hello there</h1>
      <canvas
        style={{
          border: "1px solid #000",
          allowTaint: true,
          foreignObjectRendering: true,
          width: 564,
          height: 400,
        //   paddingTop:156.6
          //   top: 80,
          //   position: "absolute"
          // background: "https://images.unsplash.com/photo-1483232539664-d89822fb5d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG8lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&w=1000&q=80"
        }}
        // width={imgWidth}
        // height={imgHeight}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        // className="canvas"
      />
      <br />
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      >
        {colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
      <button onClick={clear}>Clear</button>
    </div>
  );
};
