/** @format */
import { useState } from "react";
import ParentForm from "./AddParent";
import ParentList from "./ParentList";
import "./Parent.css";

const ManageParent = () => {
  const [activeSection, setActiveSection] = useState("show");

  return (
    <div className="manage-container">
      <h2>Manage Parent</h2>
      <div className="dropdowns">
        <button
          className={activeSection === "add" ? "active" : ""}
          onClick={() => setActiveSection("add")}
        >
          Add Parent
        </button>
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All Parents
        </button>
      </div>

      <div className="section-content">
        {activeSection === "add" ? (
          <div className="add-parent">
            <ParentForm />
          </div>
        ) : (
          <div className="show-parent">
            <ParentList />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageParent;
