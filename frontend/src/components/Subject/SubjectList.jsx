/** @format */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSubjects } from "../../redux/subjectSlice";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-modal";
import "./SubjectList.css";

Modal.setAppElement("#root");

const ShowSubjects = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects || []);
  const classes = useSelector((state) => state.classes || []);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);

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

      const updatedSubjects = subjects.filter(
        (subj) => (subj.SubjectID || subj._id) !== id
      );

      dispatch(setSubjects(updatedSubjects));
      toast.success("Subject deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete subject.");
    }
  };

  const openEditModal = (subj) => {
    setSelectedSubject(subj);
    setEditForm({ ...subj });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    const id = selectedSubject.SubjectID || selectedSubject._id;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/subject/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Failed to update subject");

      const updatedList = subjects.map((subj) =>
        (subj.SubjectID || subj._id) === id ? { ...subj, ...editForm } : subj
      );
      console.log("Updated List:", updatedList);
      dispatch(setSubjects(updatedList));
      console.log("Subjects after upadte", subjects);
      toast.success("Subject updated successfully!");
      setEditModalOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update subject.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getClassName = (id) => {
    const cls = classes.find((c) => c.ClassID === id || c._id === id);
    return cls ? cls.ClassName : "Unknown";
  };

  return (
    <div className="subject-list">
      <ToastContainer />
      <h3>Subjects List</h3>
      {subjects.length === 0 ? (
        <p>No subjects available.</p>
      ) : (
        <table className="subjects-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subj) => (
              <tr key={subj.SubjectID || subj._id}>
                <td>{subj.SubjectName}</td>
                <td>{subj.SubjectCode}</td>
                <td>{getClassName(subj.ClassID)}</td>
                <td>
                  <button
                    onClick={() => openEditModal(subj)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subj.SubjectID || subj._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✏️ Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        contentLabel="Edit Subject"
        preventScroll={false}
        className="ptm-modal"
        overlayClassName="ptm-overlay"
      >
        <h2>Edit Subject</h2>
        <form
          className="parent-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            name="SubjectName"
            value={editForm.SubjectName || ""}
            onChange={handleChange}
            placeholder="Subject Name"
            required
          />
          <input
            name="SubjectCode"
            value={editForm.SubjectCode || ""}
            onChange={handleChange}
            placeholder="Subject Code"
            required
          />
          <select
            name="ClassID"
            value={editForm.ClassID || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option
                key={cls.ClassID || cls._id}
                value={cls.ClassID || cls._id}
              >
                {cls.ClassName}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" onClick={() => setEditModalOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShowSubjects;
