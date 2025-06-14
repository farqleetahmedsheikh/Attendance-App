/** @format */

import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchPTMs,
  fetchClasses,
  fetchParents,
  fetchStudents,
  fetchSubjects,
  fetchTeachers,
} from "../services/Api/handleGetApiFunctions";
import "./dashboard.css";
import { getMenuLinks } from "../services/Options/menu"; // Import the menu configuration

const AdminDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role") || "teacher"; // default to admin if missing
  const menuList = getMenuLinks(role) || [];

  useEffect(() => {
    fetchPTMs(dispatch);
    fetchParents(dispatch);
    fetchSubjects(dispatch);
    fetchTeachers(dispatch);
    fetchClasses(dispatch);
    fetchStudents(dispatch);
  }, [dispatch]);

  const toggleDropdown = (section) => {
    setOpenDropdown((prev) => (prev === section ? "" : section));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/"); // Redirect to login
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <Link className="title" to="/dashboard/">
          <h2>{`${role} Panel`}</h2>
        </Link>
        <ul>
          {menuList.map((section) => (
            <li key={section.title}>
              <div
                className="dropdown-title"
                onClick={() => toggleDropdown(section.title)}
              >
                {section.title} ▾
              </div>
              <div
                className={`dropdown-links ${
                  openDropdown === section.title ? "open" : ""
                }`}
              >
                {section.links.map((link) => (
                  <Link key={link.path} to={link.path}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </li>
          ))}
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
