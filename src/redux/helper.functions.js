// Used to add unique barcodes to the barcode state array item
// If barcode is there we will not add it if not then we will add the barcode the the array
export const addItemIfUnique = (oldBarcodes, newBarcode) => {

    // We will check if the current barcode is in the array of the state or not
    
    const foundTheBarcode = oldBarcodes.find((oldBarcode) => {
        
        return(
            oldBarcode === newBarcode
        )
    }
    )

    if (foundTheBarcode) {
        // if we get the find the barcode we return the old array with no addition
        return [...oldBarcodes]
    }

    // we will return the new array in case we don't find the item 
    return [...oldBarcodes, newBarcode]
}


export const updatePercentage = (allFiles, actionItems) => {
    
    var arrayToReturn = allFiles.map((fileItem) => {
        if (fileItem.UUID === actionItems.UUID) {
          return {...fileItem, percentage: actionItems.percentage};
        }else {
            return {...fileItem};
        }
      });

    return arrayToReturn
}

export const updateUploadStatus = (allFiles, actionItems) => {
    
    var arrayToReturn = allFiles.map((fileItem) => {
        if (fileItem.UUID === actionItems.UUID) {
          return {...fileItem, status: actionItems.status};
        }else {
            return {...fileItem};
        }
      });

    return arrayToReturn
}
