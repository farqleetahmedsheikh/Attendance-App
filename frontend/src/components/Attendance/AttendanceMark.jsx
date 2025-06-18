/** @format */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./AttendanceMark.css"; // Assuming you have some styles for this component

const AttendanceMark = () => {
  const [filters, setFilters] = useState({
    classId: "",
    subjectId: "",
  });

  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const classes = useSelector((state) => state.classes); // Assume array
  const students = useSelector((state) => state.students.students);
  const subjects = useSelector((state) => state.subjects); // Assume array
  const teachers = useSelector((state) => state.teachers.teachers); // Assume array

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // Step 1: Filter subjects the teacher is valid to teach
  useEffect(() => {
    if (role === "teacher" && subjects.length && teachers.length) {
      const teacher = teachers.find(
        (t) => Number(t.TeacherID) === Number(userId)
      );
      console.log("Teacher:", teacher);

      if (!teacher) return;

      const allowedSubjectIDs = Array.isArray(teacher.SubjectIDs)
        ? teacher.SubjectIDs
        : String(teacher.SubjectIDs)
            .split(",")
            .map((id) => Number(id));

      const teacherSubjects = subjects.filter((subj) =>
        allowedSubjectIDs.includes(Number(subj.SubjectID))
      );
      console.log("Filtered Subjects:", teacherSubjects);

      // Add class names
      const mapped = teacherSubjects.map((subject) => {
        const cls = classes.find(
          (c) => Number(c.ClassID) === Number(subject.ClassID)
        );
        return {
          ...subject,
          ClassName: cls?.ClassName || "Unknown Class",
        };
      });

      setFilteredSubjects(mapped);
    }
  }, [role, userId, subjects, teachers, classes]);

  // Step 2: When class and subject are selected, filter students
  const handleShow = () => {
    console.log("Filters:", filters);
    const selectedSubject = subjects.find(
      (subj) => String(subj.SubjectID) === filters.subjectId
    );

    if (selectedSubject) {
      const studentsInClass = students.filter(
        (stu) => String(stu.ClassID) === String(selectedSubject.ClassID)
      );
      setFilteredStudents(studentsInClass);
      setShowTable(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mark-attendance-container">
      <h2>Select Class and Subject</h2>

      <div className="form-group">
        <label>Select Subject</label>
        <select
          name="subjectId"
          value={filters.subjectId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Subject --</option>
          {filteredSubjects.map((subject) => (
            <option key={subject.SubjectID} value={subject.SubjectID}>
              {subject.SubjectName} - {subject.ClassName}
            </option>
          ))}
        </select>
      </div>

      <button
        className="mark-btn"
        onClick={handleShow}
        disabled={!filters.subjectId}
      >
        Show Students
      </button>

      {showTable && (
        <div className="mark-attendance-container">
          <h3>Students</h3>
          {filteredStudents.length === 0 ? (
            <p>No students found for selected class.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Roll No.</th>
                  <th>Student Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.Std_ID}>
                    <td data-label="index">{index + 1}</td>
                    <td data-label="Roll No.">{student.RollNo}</td>
                    <td data-label="Student Name">{student.Std_Name}</td>
                    <td data-label="Action">
                      <button
                        className="mark-btn"
                        onClick={() => alert(`Marked: ${student.Std_Name}`)}
                      >
                        Mark
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendanceMark;
