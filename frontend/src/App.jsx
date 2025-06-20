/** @format */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import AdminDashboard from "./components/dashboard";
import Student from "./components/Student/Student";
import Teacher from "./components/Teacher/Teacher";
import Subject from "./components/Subject/Subject";
import Class from "./components/Class/Class";
import Parent from "./components/Parent/Parent";
import PTM from "./components/PtmEventPlanner/PtmPlanner";
import AttendanceView from "./components/Attendance/AttendanceView";
import AttendanceMark from "./components/Attendance/AttendanceMark";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/admin" element={<Login role="admin" />} />
        <Route path="/login/teacher" element={<Login role="teacher" />} />
        <Route path="/login/student" element={<Login role="student" />} />
        <Route path="/login/parent" element={<Login role="parent" />} />

        {/* Admin dashboard with nested routes */}
        <Route path="/dashboard" element={<AdminDashboard />}>
          <Route path="student/manage" element={<Student />} />
          <Route path="teacher/manage" element={<Teacher />} />
          <Route path="class/manage" element={<Class />} />
          <Route path="subject/manage" element={<Subject />} />
          <Route path="parent/manage" element={<Parent />} />
          <Route path="ptm/manage" element={<PTM />} />
          <Route
            path="student/attendance"
            element={<AttendanceView role="student" />}
          />
          <Route
            path="parent/attendance"
            element={<AttendanceView role="parent" />}
          />
          <Route
            path="teacher/attendance"
            element={<AttendanceView role="teacher" />}
          />
          <Route
            path="attendance/mark"
            element={<AttendanceMark role="teacher" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
