/** @format */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./AttendanceView.css";

const AttendanceView = () => {
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
  const role = localStorage.getItem("role");

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");

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

  // For teacher: filter subjects and classes
  useEffect(() => {
    if (
      role === "teacher" &&
      teachers.length > 0 &&
      subjects.length > 0 &&
      classes.length > 0
    ) {
      const teacher = teachers.find(
        (teacher) => Number(teacher.TeacherID) === Number(userId)
      );
      if (!teacher) return;

      const teacherSubjects = subjects.filter(
        (subject) => Number(teacher.SubjectIDs) === Number(subject?.SubjectID)
      );

      const subjectsWithClassName = teacherSubjects.map((subject) => {
        const classInfo = classes.find(
          (cls) => Number(cls.ClassID) === Number(subject.ClassID)
        );
        return {
          ...subject,
          ClassName: classInfo?.ClassName || "Unknown Class",
        };
      });

      setFilteredSubjects(subjectsWithClassName);

      const classIds = teacherSubjects.map((subj) => Number(subj.ClassID));
      const matchedClasses = classes.filter((cls) =>
        classIds.includes(Number(cls.ClassID))
      );

      setFilteredClasses(matchedClasses);
    }
  }, [role, userId, teachers, subjects, classes]);

  // For teacher: filter students based on selected subject
  useEffect(() => {
    if (role === "teacher" && filters.subjectId && subjects.length > 0) {
      const selectedSubject = subjects.find(
        (subject) => String(subject.SubjectID) === String(filters.subjectId)
      );

      if (selectedSubject) {
        const classId = selectedSubject.ClassID;

        const matchedStudents = students.filter(
          (student) => String(student.ClassID) === String(classId)
        );

        setFilteredStudents(matchedStudents);
      }
    }
  }, [role, filters.subjectId, subjects, students]);

  // For parent & teacher: update classId and subjects when student is selected
  useEffect(() => {
    if (filters.studentId) {
      const student = students.find(
        (s) => s.Std_ID === Number(filters.studentId)
      );

      const classId = student?.ClassID;
      setFilters((prev) => ({ ...prev, classId: classId || "" }));

      const matchedSubjects = subjects.filter(
        (subject) => subject.ClassID === classId
      );
      setFilteredSubjects(matchedSubjects);
    }
  }, [filters.studentId, students, subjects]);

  // For student role
  useEffect(() => {
    if (role === "student" && students.length > 0 && subjects.length > 0) {
      const student = students.find((s) => String(s.Std_ID) === String(userId));
      if (student) {
        const classId = student.ClassID;
        setFilters((prev) => ({
          ...prev,
          studentId: student.Std_ID,
          classId: classId || "",
        }));

        const matchedSubjects = subjects.filter(
          (subject) => subject.ClassID === classId
        );
        setFilteredSubjects(matchedSubjects);
      }
    }
  }, [role, students, subjects, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/attendance/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch attendance");

      setAttendanceData(data.attendance);
    } catch (err) {
      setError(err.message);
      setAttendanceData([]);
    }
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
                  {subject.SubjectName} - {subject.ClassName}
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
              disabled={
                (role === "teacher" && !filters.subjectId) ||
                filteredStudents.length === 0
              }
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
              disabled={!filters.studentId}
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

      {error && <p className="error-msg">{error}</p>}

      {attendanceData.length > 0 && (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Student Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((record, idx) => (
              <tr key={idx}>
                <td>{record.AttendanceDate.slice(0, 10)}</td>
                <td>{record.Std_Name}</td>
                <td>{record.IsPresent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {attendanceData.length === 0 && !error && (
        <p className="info-msg">
          No attendance data found for selected Student.
        </p>
      )}
    </div>
  );
};

export default AttendanceView;
