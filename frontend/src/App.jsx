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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/admin" element={<Login role="admin" />} />
        <Route path="/login/teacher" element={<Login role="teacher" />} />
        <Route path="/login/student" element={<Login role="student" />} />
        {/* Admin dashboard with nested routes */}
        <Route path="/dashboard" element={<AdminDashboard />}>
          <Route path="student/manage" element={<Student />} />
          <Route path="teacher/manage" element={<Teacher />} />

          <Route path="class/manage" element={<Class />} />

          <Route path="subject/manage" element={<Subject />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
