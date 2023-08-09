// @flow
import * as React from "react";
import { useState } from "react";
import { CanvasComments } from "../components/CanvasComments";
import { ImageComment } from "../components/ImageComment";
import { useDispatch, useSelector } from "react-redux";
import { changeUploadState, setBarcode } from "../redux/files.slice";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export const UploadPage = () => {
  // Upload photo
  const [files, setFiles] = useState([]);
  const barcode = useSelector((state) => state.uploadFilesReducer.barcode);
  const dispatch = useDispatch();
  function handleChange(e) {
    if (e.target.files.length > 5) {
      alert("Only 5 files accepted.");
      e.preventDefault();
      return;
    }
    setFiles(e.target.files);
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
    }else {
        alert("Please Add Images before pressing Upload")
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
      <input
        type="text"
        placeholder="scan barcode"
        onChange={(e) => {
          dispatch(setBarcode(e.target.value));
        }}
      />
      <button onClick={uploadButtonPressed}>Upload</button>
      <h2>Add Image:</h2>
      <input
        type="file"
        onChange={handleChange}
        multiple="multiple"
        id="files"
        className={"hidden"}
        accept=".jpeg, .jpg, .gif, .png"
      />
      {Object.keys(files).map((key, index) => {
        return (
          <div key={index}>
            <ImageComment
              id={index}
              imgURL={URL.createObjectURL(files[index])}
            ></ImageComment>
          </div>
        );
      })}
    </div>
  );
};
