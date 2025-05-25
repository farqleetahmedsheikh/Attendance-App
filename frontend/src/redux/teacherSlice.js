/** @format */

// redux/teacherSlice.js (new file)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teachers: [],
  subjects: [], // list of all subjects
};

const teacherSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    setTeachers(state, action) {
      state.teachers = action.payload;
    },
    addTeacher(state, action) {
      state.teachers.push(action.payload);
    },
    setSubjects(state, action) {
      state.subjects = action.payload;
    },
  },
});

export const { setTeachers, addTeacher, setSubjects } = teacherSlice.actions;
export default teacherSlice.reducer;
