/** @format */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./AttendanceView.css"; // Custom CSS file

const AttendanceView = ({ role }) => {
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    classId: "",
    studentId: "",
    subjectId: "",
  });

  const classes = useSelector((state) => state.classes);
  const students = useSelector((state) => state.students.students);
  const subjects = useSelector((state) => state.subjects || []);

  const userId = localStorage.getItem("userId");

  console.log(userId);
  console.log(classes);
  console.log(students);
  console.log(subjects);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);

  // For parent role: filter students by parentId
  useEffect(() => {
    if (role === "parent") {
      const result = students.filter(
        (student) => String(student.ParentID) === String(userId)
      );
      console.log("Filtered Students for Parent:", result);
      setFilteredStudents(result);
    } else {
      setFilteredStudents(students);
    }
  }, [role, students, userId]);

  // Update subjects when student is selected (for parent & teacher)
  useEffect(() => {
    if (filters.studentId) {
      const student = students.find((s) => s._id === filters.studentId);
      const classId = student?.ClassID;
      setFilters((prev) => ({ ...prev, classId: classId || "" }));

      const matchedSubjects = subjects.filter(
        (subject) => subject.ClassID === classId
      );
      setFilteredSubjects(matchedSubjects);
    }
  }, [filters.studentId, students, subjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Filters:", filters);
    // Add API request or Redux dispatch here
  };

  return (
    <div className="attendance-container">
      <h2 className="form-title">View Attendance ({role})</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            required
          />
        </div>

        {role === "teacher" && (
          <div className="form-group">
            <label>Select Class</label>
            <select
              name="classId"
              value={filters.classId}
              onChange={handleChange}
              required
            >
              <option value="">--Select Class--</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {(role === "teacher" || role === "parent") && (
          <div className="form-group">
            <label>Select Student</label>
            <select
              name="studentId"
              value={filters.studentId}
              onChange={handleChange}
              required
            >
              <option value="">--Select Student--</option>
              {filteredStudents.map((student) => (
                <option key={student.Std_ID} value={student.Std_ID}>
                  {student.Std_Name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Select Subject</label>
          <select
            name="subjectId"
            value={filters.subjectId}
            onChange={handleChange}
            required
          >
            <option value="">--Select Subject--</option>
            {filteredSubjects.map((subject) => (
              <option key={subject.SubjectID} value={subject.SubjectID}>
                {subject.SubjectName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">
          View Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceView;
