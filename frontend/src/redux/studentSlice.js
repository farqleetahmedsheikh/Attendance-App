/** @format */

// redux/studentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Async thunk to send student data to backend
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/api/student/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // optional if your route is protected
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add student");
      }

      const data = await response.json();
      return data; // this is returned to the reducer
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    classes: [],
    error: null,
  },
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setClasses: (state, action) => {
      state.classes = action.payload;
    },
    addStudent: (state, action) => {
      state.students.push(action.payload); // ✅ Add the new student to the store
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.error = null;
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setStudents, setClasses } = studentSlice.actions;
export default studentSlice.reducer;
