/** @format */

// components/class/ClassList.jsx

import { useSelector } from "react-redux";
import "./ListClass.css";

const ClassList = () => {
  const classes = useSelector((state) => state.classes); // ✅ From Redux
  console.log(classes);

  return (
    <div className="class-list">
      {" "}
      {/* Changed from student-list */}
      <h3>Registered Classes</h3>
      {classes.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={cls.ID || index}>
                <td data-label="Class Name">{cls.ClassName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassList;
