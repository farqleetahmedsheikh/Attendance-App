/** @format */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSubjects } from "../../redux/teacherSlice";
import AddSubject from "./AddSubject";
import ShowSubjects from "./SubjectList";
import "./Subject.css"; // Use the same style structure as Student.css
import { setClasses } from "../../redux/classSlice";

const ManageSubject = () => {
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
        dispatch(setClasses(data)); // Store subjects in Redux
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/subject/get-subjects",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch subjects");

        const data = await res.json();
        dispatch(setSubjects(data)); // Store subjects in Redux
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchClasses();
    fetchSubjects();
  }, [dispatch]);

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
