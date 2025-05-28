/** @format */

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setClasses } from "../../redux/classSlice";
import AddClassForm from "./AddClass";
import ClassList from "./ListClass";
import "./Class.css";

const ManageClass = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("show");

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

    fetchClasses();
  }, [dispatch]);
  return (
    <div className="manage-container">
      <h2>Manage Classes</h2>

      <div className="dropdowns">
        <button
          className={activeSection === "add" ? "active" : ""}
          onClick={() => setActiveSection("add")}
        >
          Add Class
        </button>
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All Classes
        </button>
      </div>

      <div className="section-content">
        {activeSection === "add" ? <AddClassForm /> : <ClassList />}
      </div>
    </div>
  );
};

export default ManageClass;
