import React, { useState } from "react";
import "./Student.css";

const ManageStudent = () => {
  const [activeSection, setActiveSection] = useState("show");

  return (
    <div className="manage-container">
      <h2>Manage Student</h2>

      <div className="dropdowns">
        <button
          className={activeSection === "add" ? "active" : ""}
          onClick={() => setActiveSection("add")}
        >
          Add Student
        </button>
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All Students
        </button>
      </div>

      <div className="section-content">
        {activeSection === "add" ? (
          <div className="add-student">
            <h3>Add New Student</h3>
            {/* Add your student form here */}
            <p>[Student Form Goes Here]</p>
          </div>
        ) : (
          <div className="show-student">
            <h3>All Students</h3>
            {/* Show student list */}
            <p>[List of students shown here]</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudent;
