/** @format */

// redux/teacherSlice.js (new file)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  parents: [],
};

const parentSlice = createSlice({
  name: "parents",
  initialState,
  reducers: {
    setParents(state, action) {
      state.parents = action.payload;
    },
    addParents(state, action) {
      state.parents.push(action.payload);
    },
  },
});

export const { setParents, addParents } = parentSlice.actions;
export default parentSlice.reducer;
