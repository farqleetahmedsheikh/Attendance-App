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
  handleGetUnreadCount,
} from "../services/Api/handleGetApiFunctions";
import "./dashboard.css";
import { getMenuLinks } from "../services/Options/menu"; // Import menu config

const AdminDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = localStorage.getItem("role") || "admin";
  const menuList = getMenuLinks(role) || [];

  useEffect(() => {
    fetchPTMs(dispatch);
    fetchParents(dispatch);
    fetchSubjects(dispatch);
    fetchTeachers(dispatch);
    fetchClasses(dispatch);
    fetchStudents(dispatch);

    const fetchUnread = async () => {
      const count = await handleGetUnreadCount();
      setUnreadCount(count || 0);
    };

    fetchUnread();
  }, [dispatch]);

  const toggleDropdown = (section) => {
    setOpenDropdown((prev) => (prev === section ? "" : section));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
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
                {section.title}
                {section.title === "Query" && unreadCount > 0 && (
                  <span className="unread-badge">{unreadCount}</span>
                )}
                ▾
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
