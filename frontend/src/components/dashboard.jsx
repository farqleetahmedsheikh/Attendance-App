import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./dashboard.css";

const AdminDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState("student"); // default open

  const toggleDropdown = (section) => {
    setOpenDropdown((prev) => (prev === section ? "" : section));
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <Link className="title" to="/dashboard/">
          <h2>Admin Panel</h2>
        </Link>
        <ul>
          {/* Student */}
          <li
            className="dropdown-title"
            onClick={() => toggleDropdown("student")}
          >
            Student ▾
          </li>
          <div
            className={`dropdown-links ${
              openDropdown === "student" ? "open" : ""
            }`}
          >
            <Link to="/dashboard/student/manage">Manage Student</Link>
          </div>

          {/* Teacher */}
          <li
            className="dropdown-title"
            onClick={() => toggleDropdown("teacher")}
          >
            Teacher ▾
          </li>
          <div
            className={`dropdown-links ${
              openDropdown === "teacher" ? "open" : ""
            }`}
          >
            <Link to="/dashboard/teacher/manage">Manage Teacher</Link>
          </div>

          {/* Subject */}
          <li
            className="dropdown-title"
            onClick={() => toggleDropdown("subject")}
          >
            Subject ▾
          </li>
          <div
            className={`dropdown-links ${
              openDropdown === "subject" ? "open" : ""
            }`}
          >
            <Link to="/dashboard/subject/manage">Manage Subject</Link>
          </div>

          {/* Class */}
          <li
            className="dropdown-title"
            onClick={() => toggleDropdown("class")}
          >
            Class ▾
          </li>
          <div
            className={`dropdown-links ${
              openDropdown === "class" ? "open" : ""
            }`}
          >
            <Link to="/dashboard/class/manage">Manage Class</Link>
          </div>
        </ul>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
