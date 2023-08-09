import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./My.css";
import { FileUploader } from "react-drag-drop-files";
const fileTypes = ["JPG", "PNG", "GIF"];

const colors = ["red", "green", "yellow", "black", "blue"];

import { useSelector, useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const number = useSelector((state) => state.uploadFilesReducer.value);
  // const file = useSelector((state) => state.uploadFilesReducer.file);

  // Getting image
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [imgWidth, setImgWidth] = useState(3456);
  const [imgHeight, setImgHeight] = useState(2304);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  // Getting image

  // Upload photo
  const [file, setFile] = useState();
  function handleChange(e) {
    if (e.target.files.length > 5) {
      alert("Only 5 files accepted.");
      e.preventDefault();
      return;
    }
    console.log(`These are the files: ${e.target.files}`);
    if (e.target.files[0] !== undefined) {
      console.log("We still come here");
      setFile(URL.createObjectURL(e.target.files[0]));
      autoLoadImage(URL.createObjectURL(e.target.files[0]));
    }
  }
  const handleChange_2 = (file) => {
    console.log(file);
    // setFile(file);
    setFile(URL.createObjectURL(file));
  };

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
    console.log(canvasRef.current)
  }, []);

  const draw = useCallback(
    (x, y) => {
      if (mouseDown) {
        ctx.current.beginPath();
        ctx.current.strokeStyle = selectedColor;
        ctx.current.lineWidth = 20;
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

  const download = async () => {
    try {
      const image = canvasRef.current.toDataURL("image/png");
      const blob = await (await fetch(image)).blob();
      const blobURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      // link.href = file;
      link.download = "image.png";
      // link.click();
      console.log(blob)
      let blob_new = await fetch(blobURL).then(r => r.blob());
      console.log(blobURL)
      console.log(blob_new)
    } catch (e) {
      console.log(e);
    }
  };

  const clear = () => {
    ctx.current.clearRect(
      0,
      0,
      ctx.current.canvas.width,
      ctx.current.canvas.height
    );
    autoLoadImage(file);
    console.log(`Hello there: ${number}`);
  };

  const loadImage = () => {
    console.log("Hello Adnan");
    // var c = document.getElementById("canvasRef");
    // var ctx = c.getContext("2d");
    // ctx.current = canvasRef.current.getContext('2d');
    var img1 = new Image();

    //drawing of the test image - img1
    img1.onload = function () {
      //draw background image
      // ctx.current.drawImage(img1, 0, 0, 750, 500);
      //draw a box over the top
      // ctx.current.fillStyle = "rgba(200, 0, 0, 0.5)";
      // ctx.current.fillRect(0, 0, 500, 500);
      // set size proportional to image
      canvasRef.current.height =
        canvasRef.current.width * (img1.height / img1.width);

      // step 1 - resize to 50%
      var oc = document.createElement("canvas"),
        octx = oc.getContext("2d");

      oc.width = img1.width * 0.5;
      oc.height = img1.height * 0.5;
      octx.drawImage(img1, 0, 0, oc.width, oc.height);

      // step 2
      octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);

      // step 3, resize to final size
      ctx.current.drawImage(
        oc,
        0,
        0,
        oc.width * 0.5,
        oc.height * 0.5,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };

    // img1.src = 'logo192.png';
    // img1.src = imgSrc;
    img1.src = file;
    // img1.src = 'https://images.unsplash.com/photo-1483232539664-d89822fb5d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG8lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&w=1000&q=80';
  };

  const onMouseDown = (e) => {
    var cssScaleX = canvasRef.current.width / canvasRef.current.offsetWidth;
    var cssScaleY = canvasRef.current.height / canvasRef.current.offsetHeight;
    setPosition({
      x: e.pageX * cssScaleX,
      y: e.pageY * cssScaleY,
    });
    setMouseDown(true);
  };

  const onMouseUp = (e) => {
    setMouseDown(false);
  };

  const onMouseMove = (e) => {
    var cssScaleX = canvasRef.current.width / canvasRef.current.offsetWidth;
    var cssScaleY = canvasRef.current.height / canvasRef.current.offsetHeight;
    draw(e.pageX * cssScaleX, e.pageY * cssScaleY);
  };

  const videoConstraints = {
    // width: 400,
    // height: 400,
    // facingMode: "user"
    // facingMode: { exact: "environment" }
  };

  return (
    <div className="App">
      <canvas
        style={{
          border: "1px solid #000",
          allowTaint: true,
          foreignObjectRendering: true,
          width: 564,
          height: 400,
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
      <button onClick={download}>Download</button>
      <input type="text" placeholder="Enter Barcode"></input>
      <button
        onClick={() => {
          // alert(
          //   "The Photo with the barcode number will be uploaded to the database"
          // );
          const image = canvasRef.current.toDataURL("image/png");
        }}
      >
        Upload to cloud
      </button>
      {/* <button onClick={loadImage}>Load Image</button> */}

      {/* <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        // videoConstraints={videoConstraints}
        // screenshotQuality={1}
      />
      <button onClick={capture}>Capture photo</button> */}
      <h2>Add Image:</h2>
      <input
        type="file"
        onChange={handleChange}
        multiple="multiple"
        id="files"
        className={"hidden"}
        accept=".jpeg, .jpg, .gif, .png"
      />

      {/* <input type="file" id="file-input" name="file-input" />
      <label id="file-input-label" htmlFor="file-input">
        Select a File
      </label> */}
      {/* <FileUploader
        handleChange={handleChange_2}
        name="file"
        types={fileTypes}
      /> */}

      {/* <img src={file}/> */}
      {/* <canvas src={file} className="carousel-item" /> */}
      {/* {imgSrc && (
        <img
          src={imgSrc}
        />
      )} */}
    </div>
  );
}

export default App;
