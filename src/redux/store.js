import { configureStore } from '@reduxjs/toolkit'
import uploadFilesReducer from './files.slice'

export const store = configureStore({
  reducer: {uploadFilesReducer},
})