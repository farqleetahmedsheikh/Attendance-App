/** @format */
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTeachers, setSubjects } from "../../redux/teacherSlice";
import TeacherForm from "./AddTeacher";
import TeacherList from "./TeacherList";
import "./Teacher.css";

const ManageTeacher = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("show");

  useEffect(() => {
    const token = localStorage.getItem("token");

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

    fetchSubjects();
    fetchTeachers();
  }, [dispatch]);

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
