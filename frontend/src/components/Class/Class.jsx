/** @format */

import { useState } from "react";

import AddClassForm from "./AddClass";
import ClassList from "./ListClass";
import "./Class.css";

const ManageClass = () => {
  const [activeSection, setActiveSection] = useState("show");
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
