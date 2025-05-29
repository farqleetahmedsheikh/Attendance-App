/** @format */
import { useSelector } from "react-redux";
import "./StudentList.css";

const StudentList = () => {
  const students = useSelector((state) => state.students.students);
  const parents = useSelector((state) => state.parents.parents || []);
  const classes = useSelector((state) => state.classes); // ✅ From Redux

  // Convert ClassID to readable name
  const getClassName = (id) => {
    const cls = classes.find((c) => c.ClassID === id || c._id === id);
    return cls ? cls.ClassName : "Unknown";
  };
console.log("Student List:", students);
  const getParentDetails = (parentId) => {
    const parent = parents.find(
      (p) => p.ParentID === parentId || p._id === parentId
    );
    return parent
      ? `${parent.ParentName} (${parent.ParentPhoneNo})`
      : "No Parent Linked";
  };

  return (
    <div className="student-list">
      <h3>Registered Students</h3>
      {students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roll No</th>
              <th>Gender</th>
              <th>Class</th>
              <th>Parent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.ID || index}>
                <td>{index + 1}</td>
                <td>{student.Std_Name}</td>
                <td>{student.Std_Email}</td>
                <td>{student.RollNo}</td>
                <td>{student.Gender}</td>
                <td>{getClassName(student.ClassID)}</td>
                <td>{getParentDetails(student.ParentID || null)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentList;
