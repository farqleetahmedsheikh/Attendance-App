import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./dashboard.css";

const AdminDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = (section) => {
    setOpenDropdown((prev) => (prev === section ? "" : section));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login/admin"); // Redirect to login
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <Link className="title" to="/dashboard/">
          <h2>Admin Panel</h2>
        </Link>
        <ul>
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
        </ul>

        {/* 🔒 Logout Button */}
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
