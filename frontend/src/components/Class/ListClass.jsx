/** @format */
import { useSelector, useDispatch } from "react-redux";
import { setClasses } from "../../redux/classSlice";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useState } from "react";
import "./ListClass.css";

Modal.setAppElement("#root");

const ClassList = () => {
  const classes = useSelector((state) => state.classes || []);
  const dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({});

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Class?",
      text: "Are you sure you want to delete this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/class/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete class");

      const targetID = selectedClass.ClassID || selectedClass._id;

      const updatedList = classes.map((cls) =>
        (cls.ClassID || cls._id) === targetID ? { ...cls, ...formData } : cls
      );

      dispatch(setClasses(updatedList));

      toast.success("Class deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete class.");
    }
  };

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({ ...cls });
    setModalIsOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/class/update/${
          selectedClass.ClassID || selectedClass._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update class");

      const targetID = selectedClass.ClassID || selectedClass._id;

      const updatedList = classes.map((cls) =>
        (cls.ClassID || cls._id) === targetID ? { ...cls, ...formData } : cls
      );

      dispatch(setClasses(updatedList));

      toast.success("Class updated successfully!");
      setModalIsOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update class.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="class-list">
      <ToastContainer />
      <h3>Registered Classes</h3>
      {classes.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.ClassID || cls._id}>
                <td data-label="Class Name">{cls.ClassName}</td>
                <td>
                  <button
                    onClick={() => openEditModal(cls)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cls.ClassID || cls._id)}
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

      {/* Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Edit Class"
        preventScroll={false}
        className="ptm-modal"
        overlayClassName="ptm-overlay"
      >
        <h2>Edit Class</h2>
        <form
          className="parent-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            name="ClassName"
            value={formData.ClassName || ""}
            onChange={handleChange}
            placeholder="Class Name"
            required
          />
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" onClick={() => setModalIsOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClassList;
