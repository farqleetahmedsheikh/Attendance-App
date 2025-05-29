/** @format */

import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "../redux/studentSlice";
import teacherReducer from "../redux/teacherSlice";
import subjectReducer from "../redux/subjectSlice";
import classReducer from "../redux/classSlice";
import parentReducer from "../redux/parentSlice";
import ptmSlice from "../redux/ptmSlice";

const store = configureStore({
  reducer: {
    students: studentReducer,
    teachers: teacherReducer,
    subjects: subjectReducer,
    classes: classReducer,
    parents: parentReducer,
    ptms: ptmSlice,
  },
});

export default store;
