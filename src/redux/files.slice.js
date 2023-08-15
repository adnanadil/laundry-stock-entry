import { createSlice } from "@reduxjs/toolkit";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  addItemIfUnique,
  updatePercentage,
  updateUploadStatus,
} from "./helper.functions";

const initialState = {
  value: 0,
  file: "",
  // Delete above this as we don't use it
  filesLoadedFromComputer: [],
  allFiles: [], // Array of objects of individual image ... we will track the images by barcode to group and UUID to update their details
  barcodeArray: [], // This array holds all the barcodes of the items that are being uploaded
  upload: false, // Upload button pressed in UI
  barcode: "", // Barcode Scanned in the upload page
};

// This the redux Thunks function it is used to carry out async logic
export const uploadImageAndDetails = (imageAndDetailsObject) => {
  return async (dispatch, getState) => {
    // We add the new entry to allFiles state value of the store
    dispatch(addNewItemToAllFiles(imageAndDetailsObject));
    dispatch(addNewUniqueBarCode(imageAndDetailsObject.barcode));

    const updatedState = getState();
    console.log(updatedState.uploadFilesReducer.allFiles);
    console.log(updatedState.uploadFilesReducer.barcodeArray);

    // We will carry out the upload in the try catch block
    try {
      const storageRef = ref(
        storage,
        `${imageAndDetailsObject.barcode}/${imageAndDetailsObject.imageName}`
      );

      const blob = await (await fetch(imageAndDetailsObject.imgBlogURL)).blob();
      //   uploadBytes(storageRef, blob).then((snapshot) => {
      //     console.log("Uploaded a blob or file!");
      //   });
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");

          dispatch(
            updatePercentageOfUpload({
              UUID: imageAndDetailsObject.UUID,
              percentage: progress,
            })
          );
          // dispatch(incrementByAmount(10));
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              // Status: UPLOADING .... !!!!
              dispatch(
                updateStatusOfUpload({
                  UUID: imageAndDetailsObject.UUID,
                  status: "Uploading",
                })
              );
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(`ERROR UPLOADING !!! ${error}`);
          dispatch(
            updateStatusOfUpload({
              UUID: imageAndDetailsObject.UUID,
              status: "Error",
            })
          );
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            const docData = {
              barcode: imageAndDetailsObject.barcode,
              imgURL: downloadURL,
              comment: imageAndDetailsObject.comment,
              UUID: imageAndDetailsObject.UUID,
              imgLocationInStorage: imageAndDetailsObject.imgLocationInStorage
            };
            addDetailsToDB(docData);
            // Status: Success DONE !!!!
            dispatch(
              updateStatusOfUpload({
                UUID: imageAndDetailsObject.UUID,
                status: "Uploaded",
              })
            );
            console.log(`Updated state:`);
            const updatedState_2 = getState();
            console.log(updatedState_2.uploadFilesReducer.allFiles);
          });
        }
      );
    } catch (error) {
      // Ensure we only catch network errors
      //   dispatch(requestFailed(error.message));
      // Bail out early on failure
      console.log(`Error: ${error}`);
      // Status: FAILED TO UPLOAD
      dispatch(
        updateStatusOfUpload({
          UUID: imageAndDetailsObject.UUID,
          status: "Error",
        })
      );

      return;
    }

    const addDetailsToDB = async (docData) => {
      try {
        const washingtonRef = doc(db, "entires", docData.barcode);
        await updateDoc(washingtonRef, {
          imgsAndComments: arrayUnion(docData),
        });
      } catch (e) {
        console.log(`error while adding details to db ${e}`);
        // We have to delete the file and restart upload in this case...
      }
    };
    // We now have the result and there's no error. Dispatch "fulfilled".
    // We will also the remove the item from local redux as there is no need to display it
    // dispatch(requestSucceeded(response.data));
    // dispatch(incrementByAmount(someValue));
  };
};

// This is my redux slice
export const fileSlice = createSlice({
  name: "uploadFiles",
  initialState,
  reducers: {
    setFile: (state, action) => {
      state.file = action.payload;
    },
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      // state.value += action.payload;
      console.log(`we are here ${action.payload}`);
      state.value = action.payload;
    },
    // Functions above this are waste and we will have to delete them
   
    // We will use this function to remove all items related to a barcode (action not in use anywhere)
    setFilesLoadedFromComputer: (state, action) => {
      state.filesLoadedFromComputer = action.payload
    },
    addToFilesLoadedFromComputer: (state, action) => {
      state.filesLoadedFromComputer = state.filesLoadedFromComputer.push(action.payload)
    },
    deleteFromFilesLoadedFromComputer: (state, action) => {
      state.filesLoadedFromComputer = state.filesLoadedFromComputer.filter(
        (eachItem) => eachItem !== action.payload
      );
    },
    deleteAllEntriesForBarcode: (state, action) => {
      state.allFiles = state.allFiles.filter(
        (eachItem) => eachItem.barcode !== action.payload
      );
    },
    // We add new entries to the allFiles array using this action
    addNewItemToAllFiles: (state, action) => {
      state.allFiles = [...state.allFiles, action.payload];
    },
    // Updating the percentage of upload
    updatePercentageOfUpload: (state, action) => {
      state.allFiles = updatePercentage(state.allFiles, action.payload);
    },
    updateStatusOfUpload: (state, action) => {
      state.allFiles = updateUploadStatus(state.allFiles, action.payload);
    },
    // Creating/ adding to array of barcode
    addNewUniqueBarCode: (state, action) => {
      state.barcodeArray = addItemIfUnique(state.barcodeArray, action.payload);
    },
    // When we press the upload button this action is called to changed the upload state to positive
    changeUploadState: (state, action) => {
      state.upload = action.payload;
    },
    // Setting the barcode of current upload
    setBarcode: (state, action) => {
      state.barcode = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setFile,
  increment,
  decrement,
  incrementByAmount,
  setFilesLoadedFromComputer,
  addToFilesLoadedFromComputer,
  deleteFromFilesLoadedFromComputer,
  deleteAllEntriesForBarcode,
  updatePercentageOfUpload,
  updateStatusOfUpload,
  addNewItemToAllFiles,
  addNewUniqueBarCode,
  changeUploadState,
  setBarcode,
} = fileSlice.actions;

export default fileSlice.reducer;
