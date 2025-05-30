/** @format */
import { useSelector, useDispatch } from "react-redux";
import { setSubjects } from "../../redux/subjectSlice"; // Import delete action and setter
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-modal";
import "./SubjectList.css";

Modal.setAppElement("#root");

const ShowSubjects = () => {
  const subjectsData = useSelector((state) => state.subjects || []);
  // const subjects = subjectsData.subjects || [];
  const classes = useSelector((state) => state?.classes || []);
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Subject?",
      text: "Are you sure you want to delete this subject?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/subject/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete subject");

      dispatch(
        setSubjects(subjectsData.filter((subj) => subj.SubjectID !== id))
      ); // Update Redux store
      toast.success("Subject deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete subject.");
    }
  };

  // Convert ClassID to readable name
  const getClassName = (id) => {
    const cls = classes.find((c) => c.ClassID === id || c._id === id);
    return cls ? cls.ClassName : "Unknown";
  };

  return (
    <div className="subject-list">
      <ToastContainer />
      <h3>Subjects List</h3>
      {subjectsData.length === 0 ? (
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjectsData.map((subj) => (
              <tr key={subj.SubjectID || subj._id}>
                <td>{subj.SubjectName}</td>
                <td>{subj.SubjectCode}</td>
                <td>{getClassName(subj.ClassID)}</td>
                <td>
                  <button
                    onClick={() => handleDelete(subj.SubjectID || subj._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
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
