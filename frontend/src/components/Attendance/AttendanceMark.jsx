/** @format */
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import ReactWebcam from "react-webcam";
import { markStudentAttendance } from "../../services/Api/handleAttendanceApiFunctions";
import { ToastContainer, toast } from "react-toastify";
import "./AttendanceMark.css";

const AttendanceMark = () => {
  const webcamRef = useRef(null);
  const [filters, setFilters] = useState({ subjectId: "" });
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const classes = useSelector((state) => state.classes);
  const students = useSelector((state) => state.students.students);
  const subjects = useSelector((state) => state.subjects);
  const teachers = useSelector((state) => state.teachers.teachers);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "teacher" && subjects.length && teachers.length) {
      const teacher = teachers.find(
        (t) => Number(t.TeacherID) === Number(userId)
      );
      if (!teacher) return;

      const allowed = Array.isArray(teacher.SubjectIDs)
        ? teacher.SubjectIDs
        : String(teacher.SubjectIDs).split(",").map(Number);

      const teacherSubjects = subjects.filter((s) =>
        allowed.includes(Number(s.SubjectID))
      );
      const mapped = teacherSubjects.map((subj) => ({
        ...subj,
        ClassName:
          classes.find((c) => Number(c.ClassID) === Number(subj.ClassID))
            ?.ClassName || "Unknown Class",
      }));
      setFilteredSubjects(mapped);
    }
  }, [role, userId, subjects, teachers, classes]);

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleShow = () => {
    const sel = subjects.find((s) => String(s.SubjectID) === filters.subjectId);
    if (sel) {
      const studs = students.filter(
        (stu) => String(stu.ClassID) === String(sel.ClassID)
      );
      setFilteredStudents(studs);
      setShowTable(true);
    }
  };

  const handleFaceCaptureAndMark = (student) => {
    setCurrentStudent(student);
    setIsCameraOpen(true);
  };

  const captureAndCompare = async () => {
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      toast.error("Could not capture photo.");
      return;
    }

    try {
      setIsLoading(true);

      const studentImageUrl = `http://localhost:4000/student-images/${currentStudent.StdImages}`;

      const [knownRes, testRes] = await Promise.all([
        fetch(studentImageUrl),
        fetch(screenshot),
      ]);

      const knownBlob = await knownRes.blob();
      const testBlob = await testRes.blob();

      const formData = new FormData();
      formData.append("known", knownBlob, "known.jpg");
      formData.append("test", testBlob, "test.jpg");

      const response = await fetch("http://localhost:5000/match", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      const { matched, message } = result;

      if (matched) {
        const attendanceRes = await markStudentAttendance({
          studentId: currentStudent.Std_ID,
          subjectId: filters.subjectId,
          status: "Present",
        });

        if (attendanceRes.ok) {
          toast.success(
            `Face matched. Attendance marked for ${currentStudent.Std_Name}`
          );
        } else {
          toast.error("Failed to mark attendance: " + attendanceRes.data.error);
        }
      } else {
        toast.error(`Face mismatch: ${message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error during face recognition or attendance marking.");
    } finally {
      setIsLoading(false);
      setIsCameraOpen(false);
      setCurrentStudent(null);
    }
  };

  return (
    <>
      <ToastContainer />
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
            {filteredSubjects.map((s) => (
              <option key={s.SubjectID} value={s.SubjectID}>
                {s.SubjectName} - {s.ClassName}
              </option>
            ))}
          </select>
        </div>
        <button
          className="mark-btn"
          onClick={handleShow}
          disabled={!filters.subjectId || isLoading}
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
                    <th>#</th>
                    <th>Roll No.</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((stu, idx) => (
                    <tr key={stu.Std_ID}>
                      <td>{idx + 1}</td>
                      <td>{stu.RollNo}</td>
                      <td>{stu.Std_Name}</td>
                      <td>
                        <button
                          className="mark-btn"
                          onClick={() => handleFaceCaptureAndMark(stu)}
                          disabled={isLoading}
                        >
                          Mark Present
                        </button>
                        <button
                          className="absent-btn"
                          onClick={async () => {
                            try {
                              setIsLoading(true);
                              const res = await markStudentAttendance({
                                studentId: stu.Std_ID,
                                subjectId: filters.subjectId,
                                status: "Absent",
                              });
                              if (res.ok) {
                                toast.success(`Marked ${stu.Std_Name} as Absent`);
                              } else {
                                toast.error("Failed to mark absent: " + res.data.error);
                              }
                            } catch (err) {
                              console.error(err);
                              toast.error("Error marking absent.");
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={isLoading}
                        >
                          Mark Absent
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {isCameraOpen && (
          <div className="camera-popup">
            <ReactWebcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
            />
            <div className="camera-controls">
              <button onClick={captureAndCompare} disabled={isLoading}>
                Capture & Verify
              </button>
              <button
                onClick={() => {
                  setIsCameraOpen(false);
                  setCurrentStudent(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Processing, please wait...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendanceMark;
