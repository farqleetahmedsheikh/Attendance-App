/** @format */
import { useState } from "react";

import StudentForm from "./AddStudent";
import StudentList from "./StudentList";
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
            <StudentForm />
          </div>
        ) : (
          <div className="show-student">
            <StudentList />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudent;
