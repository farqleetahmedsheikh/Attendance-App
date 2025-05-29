/** @format */
import { useSelector } from "react-redux";
import "./SubjectList.css";

const ShowSubjects = () => {
  const subjects = useSelector((state) => state.subjects || []);
  const classes = useSelector((state) => state?.classes || []);
  // Convert ClassID to readable name
  const getClassName = (id) => {
    const cls = classes.find((c) => c.ClassID === id || c._id === id);
    return cls ? cls.ClassName : "Unknown";
  };

  return (
    <div className="subject-list">
      <h3>Subjects List</h3>
      {subjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        <table
          className="subjects-table"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Class Name</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj) => (
              <tr key={subj.SubjectID || subj._id}>
                <td>{subj.SubjectName}</td>
                <td>{subj.SubjectCode}</td>
                <td>{getClassName(subj.ClassID)}</td>
                {/* Add more cells if you want */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowSubjects;
