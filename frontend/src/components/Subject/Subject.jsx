/** @format */
import { useState } from "react";

import AddSubject from "./AddSubject";
import ShowSubjects from "./SubjectList";
import "./Subject.css"; // Use the same style structure as Student.css

const ManageSubject = () => {
  const [activeSection, setActiveSection] = useState("show");

  return (
    <div className="manage-container">
      <h2>Manage Subjects</h2>
      <div className="dropdowns">
        <button
          className={activeSection === "add" ? "active" : ""}
          onClick={() => setActiveSection("add")}
        >
          Add Subject
        </button>
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All Subjects
        </button>
      </div>

      <div className="section-content">
        {activeSection === "add" ? (
          <div className="add-subject">
            <AddSubject />
          </div>
        ) : (
          <div className="show-subjects">
            <ShowSubjects />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSubject;
