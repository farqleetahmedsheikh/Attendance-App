/** @format */

// subjectSlice.js
import { createSlice } from "@reduxjs/toolkit";

const subjectSlice = createSlice({
  name: "subjects",
  initialState: [],
  reducers: {
    setSubjects: (state, action) => {
      return action.payload;
    },
    addSubject: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setSubjects, addSubject } = subjectSlice.actions;
export default subjectSlice.reducer;
