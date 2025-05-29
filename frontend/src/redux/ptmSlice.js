/** @format */

// subjectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const ptmSlice = createSlice({
  name: "subjects",
  initialState: [],
  reducers: {
    setPTMs: (state, action) => {
      return action.payload;
    },
    addPTM: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setPTMs, addPTM } = ptmSlice.actions;
export default ptmSlice.reducer;
