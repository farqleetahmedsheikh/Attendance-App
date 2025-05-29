/** @format */
import { useSelector } from "react-redux";
import "./TeacherList.css";

const TeacherList = () => {
  const teachers = useSelector((state) => state.teachers?.teachers || []);
  const subjects = useSelector((state) => state.subjects || []);
  const classes = useSelector((state) => state.classes);

  const getClassName = (classId) => {
    const cls = classes.find((c) => c.ClassID === classId || c._id === classId);
    return cls ? cls.ClassName : "Unknown Class";
  };
  const getSubjectDetails = (subjectIDs) => {
    if (!Array.isArray(subjectIDs)) return "";

    return subjectIDs
      .map((id) => {
        const subject = subjects.find(
          (subj) => subj.SubjectID === id || subj._id === id
        );

        if (!subject) return null;

        const className = getClassName(subject.ClassID);
        return `${subject.SubjectName} (Class ${className})`;
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
                <td>{getSubjectDetails(t.SubjectIDs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherList;
