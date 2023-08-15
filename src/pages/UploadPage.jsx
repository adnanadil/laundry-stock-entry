// @flow
import * as React from "react";
import { useState } from "react";
import { CanvasComments } from "../components/CanvasComments";
import { ImageComment } from "../components/ImageComment";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUploadState,
  setBarcode,
  setFilesLoadedFromComputer,
  addToFilesLoadedFromComputer,
} from "../redux/files.slice";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../My.css";
import { useEffect, useRef } from "react";
import { Box, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export const UploadPage = () => {
  // Upload photo
  const [files, setFiles] = useState([]);
  const [filesSuccessfullyAdded, setFilesSuccessfullyAdded] = useState(false);
  const barcodeInput = useRef("");
  const barcode = useSelector((state) => state.uploadFilesReducer.barcode);
  // const files = useSelector((state) => state.uploadFilesReducer.filesLoadedFromComputer);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   // console.log(`Re-render`);
  //   // barcodeInput.current.focus();
  //   // tempFiles = Object.create(files)
  // }, []);

  const resetViewAndState = () => {
    setFilesSuccessfullyAdded(false);
    //and the barcode state
    dispatch(setBarcode(""));
    // Delete all the files (aka clear the files array)
    setFiles([]);
    // Clear the barcode input field
    //  barcodeInput.current.value = "";
    //  barcodeInput.current.focus();
  };

  const onInputClick = (event) => {
    event.target.value = "";
  };

  function handleChange(e) {
    if (e.target.files.length > 5) {
      alert("Only 5 files accepted.");
      e.preventDefault();
      return;
    }
    // var array = Object.values(e.target.files);
    console.log(`We setted`);
    var array = Array.from(e.target.files);
    console.log(array);
    setFiles(array);
    setFilesSuccessfullyAdded(true);
    // setFiles({ ...array }); // array to object
  }

  function deleteAllImages() {
    setFiles([]);
  }

  function addExtraImage(e) {
    if (files.length < 5) {
      if (files.length + e.target.files.length > 5) {
        alert(`Maximum allowed images are 5`);
      } else {
        var array = [...files, ...e.target.files];
        // array.push(e.target.files[0])
        setFiles(array);
      }
    } else {
      alert(`You have reached the limit of 5`);
    }
  }

  function removeItem(index) {
    var array = [...files];
    array.splice(index, 1);
    setFiles(array);
  }

  const uploadButtonPressed = () => {
    if (files.length != 0) {
      // ADD SPINNER TO UPLOAD BUTTON
      const docData = {
        barcode: barcode,
        date: Date.now(),
        imgsAndComments: [],
      };
      initiateUpload(docData);
    } else {
      alert("Please Add Images before pressing Upload");
    }
  };

  const initiateUpload = async (docData) => {
    try {
      await setDoc(doc(db, "entires", docData.barcode), docData);
      dispatch(changeUploadState(true));
      // alert("how fast was that?")
      // REMOVE THE SPINNER OF THE UPLOAD BUTTON
    } catch (e) {
      console.log(`error while creating document in firebase ${e}`);
      // REMOVE THE SPINNER OF THE UPLOAD BUTTON AND THROW AND ERROR
    }
  };

  return (
    <div>
      {/* <CanvasComments></CanvasComments> */}
      {!filesSuccessfullyAdded && (
        <Grid2 container spacing={4}>
          <Grid2
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
          >
            <h1 style={{ margin: 0 }}>New Order Entry</h1>
          </Grid2>
          <Grid2
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
          >
            <TextField
              autoFocus
              inputRef={barcodeInput}
              ref={barcodeInput}
              label="scan barcode"
              variant="outlined"
              onChange={(e) => {
                dispatch(setBarcode(e.target.value));
              }}
            />
          </Grid2>
          <Grid2
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
            sx={{ margin: 10 }}
          >
            {barcode !== "" && (
              <div>
                <input
                  type="file"
                  id="file-input"
                  name="file-input"
                  onChange={handleChange}
                  multiple="multiple"
                  className={"hidden"}
                  accept=".jpeg, .jpg, .gif, .png"
                  onClick={onInputClick}
                />
                <label id="file-input-label" htmlFor="file-input">
                  Select Images To Upload
                </label>
              </div>
            )}
          </Grid2>
        </Grid2>
      )}
      <br></br>
      {filesSuccessfullyAdded && (
        <Grid2 container spacing={4}>
          <Grid2 display="flex" justifyContent="center" alignItems="center" xs={2.4}>
            <Typography variant="h4">{`Barcode Number: ${barcode}`}</Typography>
          </Grid2>
          <Grid2 display="flex" justifyContent="center" alignItems="center" xs={2.4}>
            <input
              type="file"
              id="file-input-add"
              name="file-input-add"
              onChange={addExtraImage}
              multiple="multiple"
              className={"hidden"}
              accept=".jpeg, .jpg, .gif, .png"
              onClick={onInputClick}
            />
            <label id="file-input-label-add" htmlFor="file-input-add">
              + Add Images
            </label>
          </Grid2>
          <Grid2 display="flex" justifyContent="center" alignItems="center" xs={2.4}>
            <button onClick={resetViewAndState}>Reset</button>
          </Grid2>
          <Grid2 display="flex" justifyContent="center" alignItems="center" xs={2.4}>
            <button onClick={deleteAllImages}>Remove all images</button>
          </Grid2>
          <Grid2 display="flex" justifyContent="center" alignItems="center" xs={2.4}>
            <button onClick={uploadButtonPressed}>Upload</button>
          </Grid2>
        </Grid2>
      )}

      {/* <input
        type="file"
        onChange={handleChange}
        multiple="multiple"
        id="files"
        className={"hidden"}
        accept=".jpeg, .jpg, .gif, .png"
      /> */}
      {/* {Object.keys(files).map((key, index) => {
        return (
          <div key={index}>
            <ImageComment
              id={index}
              imgURL={URL.createObjectURL(files[index])}
              removeItem={removeItem}
            ></ImageComment>
          </div>
        );
      })} */}
      {filesSuccessfullyAdded &&
        files.map((eachItem, index) => {
          return (
            <div key={index}>
              <ImageComment
                id={index}
                imgURL={URL.createObjectURL(eachItem)}
                removeItem={removeItem}
              ></ImageComment>
            </div>
          );
        })}
    </div>
  );
};
