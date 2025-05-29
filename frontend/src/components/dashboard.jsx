import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setClasses } from "../redux/classSlice";
import { setStudents } from "../redux/studentSlice";
import { setParents } from "../redux/parentSlice";
import { setTeachers } from "../redux/teacherSlice";
import { setSubjects } from "../redux/subjectSlice";
import "./dashboard.css";

const AdminDashboard = () => {
  const [openDropdown, setOpenDropdown] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/class/get-classes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch classes");

        const data = await res.json();
        dispatch(setClasses(data)); // Store classes in Redux
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/student/get-students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        dispatch(setStudents(data)); // Store students in Redux
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/subject/get-subjects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        dispatch(setSubjects(data)); // store subjects in redux
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    const fetchTeachers = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/teacher/get-teachers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch teachers");
        const data = await res.json();
        dispatch(setTeachers(data)); // store teachers in redux
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    const fetchParents = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          "http://localhost:4000/api/parent/get-parents",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch parents");
        const data = await res.json();
        dispatch(setParents(data));
      } catch (error) {
        console.error("Error fetching parents:", error);
      }
    };

    fetchParents();
    fetchSubjects();
    fetchTeachers();
    fetchClasses();
    fetchStudents();
  }, [dispatch]);

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
            onClick={() => toggleDropdown("parent")}
          >
            Parent ▾
          </li>
          <div
            className={`dropdown-links ${
              openDropdown === "parent" ? "open" : ""
            }`}
          >
            <Link to="/dashboard/parent/manage">Manage Parent</Link>
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

          <li className="dropdown-title" onClick={() => toggleDropdown("ptm")}>
            PTM ▾
          </li>
          <div
            className={`dropdown-links ${openDropdown === "ptm" ? "open" : ""}`}
          >
            <Link to="/dashboard/ptm/manage">Manage PTM</Link>
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
