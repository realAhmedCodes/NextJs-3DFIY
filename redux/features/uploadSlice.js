// redux/features/uploadSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fileId: null,
  fileName: "",
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setFile: (state, action) => {
      state.fileId = action.payload.fileId;
      state.fileName = action.payload.fileName;
    },
    clearFile: (state) => {
      state.fileId = null;
      state.fileName = "";
    },
  },
});

export const { setFile, clearFile } = uploadSlice.actions;
export default uploadSlice.reducer;
