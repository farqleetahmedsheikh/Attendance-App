/** @format */
import { useState } from "react";

import TeacherForm from "./AddTeacher";
import TeacherList from "./TeacherList";
import "./Teacher.css";

const ManageTeacher = () => {
  const [activeSection, setActiveSection] = useState("show");

  return (
    <div className="manage-container">
      <h2>Manage Teacher</h2>
      <div className="dropdowns">
        <button
          className={activeSection === "add" ? "active" : ""}
          onClick={() => setActiveSection("add")}
        >
          Add Teacher
        </button>
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All Teachers
        </button>
      </div>

      <div className="section-content">
        {activeSection === "add" ? (
          <div className="add-teacher">
            <TeacherForm />
          </div>
        ) : (
          <div className="show-teacher">
            <TeacherList />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeacher;
