/** @format */
import { useSelector } from "react-redux";
import "./TeacherList.css";

const TeacherList = () => {
  const teachers = useSelector((state) => state.teachers?.teachers || []);
  const subjects = useSelector((state) => state.teachers?.subjects || []);

  const getSubjectNames = (subjectIDs) => {
    if (!Array.isArray(subjectIDs)) return "";
    return subjectIDs
      .map((id) => {
        const subject = subjects.find(
          (subj) => subj.SubjectID === id || subj._id === id
        );
        return subject ? subject.SubjectName : "";
      })
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="teacher-list">
      <h3>Teachers List</h3>
      {teachers.length === 0 ? (
        <p>No teachers added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subjects</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.TeacherID || t._id}>
                <td>{t.TeacherName}</td>
                <td>{t.TeacherEmail}</td>
                <td>{t.TeacherPhoneNo}</td>
                <td>{getSubjectNames(t.SubjectID)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherList;
