// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import "./App.css";
import Home from "./components/Home";
import Contact from "./components/Contact";
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
import Query from "./components/Query/Query";
import QueryList from "./components/Query/QueryList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/login/admin" element={<Login role="admin" />} />
        <Route path="/login/teacher" element={<Login role="teacher" />} />
        <Route path="/login/student" element={<Login role="student" />} />
        <Route path="/login/parent" element={<Login role="parent" />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="student/manage" element={<Student />} />
          <Route path="teacher/manage" element={<Teacher />} />
          <Route path="class/manage" element={<Class />} />
          <Route path="subject/manage" element={<Subject />} />
          <Route path="parent/manage" element={<Parent />} />
          <Route path="ptm/manage" element={<PTM />} />
          <Route path="query/manage" element={<QueryList />} />
          <Route
            path="student/attendance"
            element={<AttendanceView role="student" />}
          />
          <Route path="parent/query" element={<Query />} />
          <Route
            path="parent/attendance"
            element={<AttendanceView role="parent" />}
          />
          <Route path="teacher/query" element={<Query />} />
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
