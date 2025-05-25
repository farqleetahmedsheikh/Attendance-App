/** @format */

import { createSlice } from "@reduxjs/toolkit";

const classSlice = createSlice({
  name: "classes",
  initialState: [],
  reducers: {
    setClasses: (state, action) => action.payload,
    addClass: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { setClasses, addClass } = classSlice.actions;
export default classSlice.reducer;
