// @flow
import * as React from "react";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeUploadState, uploadImageAndDetails } from "../redux/files.slice";

import { v4 as uuidv4 } from "uuid";

export const ImageComment = ({ id, imgURL, removeItem }) => {
  const [comment, setComment] = useState("No Comments Made!");
  const [imgBlogURL, setImgBlogURL] = useState();

  const uploadPressed = useSelector((state) => state.uploadFilesReducer.upload);
  const barcode = useSelector((state) => state.uploadFilesReducer.barcode);
  const dispatch = useDispatch();

  useEffect(() => {
    // We are doing this to all the user to change individual image if needed
    setImgBlogURL(imgURL);
  }, [imgURL]);

  useEffect(() => {
    if (uploadPressed) {
      console.log("Reached here");
    //   console.log(barcode);
    //   console.log(imgBlogURL);
    //   console.log(uuidv4());
    //   console.log(`Image name prefix ${id}`);
      // We will add the status of it here
      // we also need to add the upload percentage
      // we also need to create UUID and attach it
    //   console.log(`Upload is pressed !!!!!`);
      var imageAndDetailsObject = {
        barcode: barcode,
        comment: comment,
        imgBlogURL: imgBlogURL,
        UUID: uuidv4(),
        imageName: `img-${id}`,
        status: `toBeUploaded`,
        percentage: 0,
        imgLocationInStorage: `${barcode}/img-${id}`
      };
      dispatch(uploadImageAndDetails(imageAndDetailsObject));
      dispatch(changeUploadState(false));
    }
  }, [uploadPressed]);

  function handleChange(e) {
    console.log(`These are the files:`);
    if (e.target.files[0] !== undefined) {
      setImgBlogURL(URL.createObjectURL(e.target.files[0]));
    }
  }


  const commentedAdded = (e) => {
    setComment(e.target.value);
  };

  return (
    <div>
      <img
        style={{
          width: 564,
          height: 400,
        }}
        src={imgBlogURL}
      ></img>
      <br></br>
      <input
        style={{
          width: 344,
          height: 50,
          //   marginLeft:20,
          //   marginRight:20
        }}
        type="text"
        placeholder="Comments"
        onChange={commentedAdded}
      />
      <input
        type="file"
        onChange={handleChange}
        id="files"
        className={"hidden"}
        accept=".jpeg, .jpg, .gif, .png"
      />
      <button onClick={() => removeItem(id)}>Delete</button>
    </div>
  );
};

ImageComment.propTypes = {
  imgURL: PropTypes.string,
  id: PropTypes.number,
  removeItem: PropTypes.func
};
