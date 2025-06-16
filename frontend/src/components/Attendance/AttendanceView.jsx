/** @format */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./AttendanceView.css"; // Custom CSS file
// import { use } from "react";

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
  const teachers = useSelector((state) => state.teachers.teachers);

  const userId = localStorage.getItem("userId");

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  // const [filteredClasses, setFilteredClasses] = useState([]);

  // For parent role: filter students by parentId
  useEffect(() => {
    if (role === "parent") {
      const result = students.filter(
        (student) => String(student.ParentID) === String(userId)
      );

      setFilteredStudents(result);
    } else {
      setFilteredStudents(students);
    }
  }, [role, students, userId]);

  useEffect(() => {
    if (role === "teacher") {
      const teacher = teachers.find(
        (teacher) => Number(teacher.TeacherID) === Number(userId)
      );
      const teacherSubjects = subjects.filter(
        (subject) => Number(teacher.SubjectIDs) === Number(subject?.SubjectID) // ✅ Ensure this matches your subject's field for teacher ID
      );

      // setFilteredSubjects(teacherSubjects);
      // console.log("Teacher's subjects:", teacherSubjects);
      const filteredClassIds = teacherSubjects.find(
        (subject) => Number(subject.ClassID) === Number(classes.ClassID)
      );
      console.log("Filtered Classes:", filteredClassIds);
    }
  }, [role, userId]); // ✅ Ensure this matches your subject's field for teacher ID

  // Update subjects when student is selected (for parent & teacher)
  useEffect(() => {
    if (filters.studentId) {
      const student = students.find(
        (s) => s.Std_ID === Number(filters.studentId)
      ); // ✅ Fix ID

      const classId = student?.ClassID; // ✅ Make sure this matches your actual field name

      setFilters((prev) => ({ ...prev, classId: classId || "" }));

      const matchedSubjects = subjects.filter(
        (subject) => subject.ClassID === classId // ✅ Match with your subject's field
      );
      setFilteredSubjects(matchedSubjects);
    }
  }, [filters.studentId, students, subjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  // Show student subject only
  useEffect(() => {
    console.log("teachers:", teachers);
    console.log("students:", students);
    console.log("subjects:", subjects);
    console.log("userId:", userId);
    if (role === "student" && students.length > 0 && subjects.length > 0) {
      const student = students.find((s) => String(s.Std_ID) === String(userId));
      console.log("Logged in student:", student);
      if (student) {
        const classId = student.ClassID;
        console.log("Class ID:", classId);

        setFilters((prev) => ({
          ...prev,
          studentId: student.Std_ID,
          classId: classId || "",
        }));

        const matchedSubjects = subjects.filter(
          (subject) => subject.ClassID === classId
        );
        setFilteredSubjects(matchedSubjects);
      } else {
        console.warn("Logged in student not found in students list.");
      }
    }
  }, [role, students, subjects, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
                  {subject.SubjectName - subject.className}
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

        {role !== "teacher" && (
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
        )}

        <button type="submit" className="submit-btn">
          View Attendance
        </button>
      </form>
    </div>
  );
};

export default AttendanceView;
