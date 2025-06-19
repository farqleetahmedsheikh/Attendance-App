/** @format */
import { useDispatch, useSelector } from "react-redux";
import { setParents } from "../../redux/parentSlice"; // Import the correct action
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-modal";
import "./ParentList.css"; // Make sure this file exists

Modal.setAppElement("#root");

const ParentList = () => {
  const dispatch = useDispatch();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null); // Use parent-related state
  const [formData, setFormData] = useState({});
  const parents = useSelector((state) => state.parents.parents || []);
  // console.log("Parents Data:", parentsData); Debugging line to check the data structure
  // const  = parentsData.parents || [];
  console.log("Parents List:", parents); // Debugging line to check the list

  if (!Array.isArray(parents)) {
    return <p className="error">Error: Invalid parent data format.</p>;
  }

  const genders = [
    { ID: "1", Name: "Male" },
    { ID: "2", Name: "Female" },
    { ID: "3", Name: "Not to say" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // The handleSubjectChange function is not relevant for parents, so we'll remove it.

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Parent?", // Correct title
      text: "Are you sure you want to delete this parent?", // Correct text
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
        `http://localhost:4000/api/parent/delete/${id}`, // Correct endpoint
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete parent"); // Correct message

      dispatch(setParents(parents.filter((p) => p.ParentID !== id))); // Correct dispatch
      toast.success("Parent deleted successfully!"); // Correct message
    } catch {
      toast.error("Failed to delete parent."); // Correct message
    }
  };

  const openEditModal = (parent) => {
    setSelectedParent(parent); // Use parent object
    setFormData({
      ...parent,
    });
    setModalIsOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/parent/update/${
          selectedParent.ParentID || selectedParent._id
        }`, // Correct endpoint
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update parent"); // Correct message

      const updatedList = parents.map((p) =>
        p.ParentID === (selectedParent.ParentID || selectedParent._id) ||
        p._id === (selectedParent.ParentID || selectedParent._id)
          ? { ...p, ...formData }
          : p
      );
      dispatch(setParents(updatedList)); // Correct dispatch
      toast.success("Parent updated successfully!"); // Correct message
      setModalIsOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update parent."); // Correct message
    }
  };

  return (
    <div className="parent-list">
      <ToastContainer />
      <h3>Parent List</h3>
      {parents.length === 0 ? (
        <p className="no-data">No parents added yet.</p>
      ) : (
        <table className="parent-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th> {/* Added Actions column */}
            </tr>
          </thead>
          <tbody>
            {parents.map((p) => (
              <tr key={p.ParentID || p._id}>
                <td>{p.ParentName}</td>
                <td>{p.ParentEmail}</td>
                <td>{p.ParentPhoneNo}</td>
                <td>{p.Address}</td>
                <td>
                  <button onClick={() => openEditModal(p)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.ParentID || p._id)}
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
        contentLabel="Edit Parent" // Correct label
        preventScroll={false}
        className="ptm-modal"
        overlayClassName="ptm-overlay"
      >
        <h2>Edit Parent</h2> {/* Correct heading */}
        <form
          className="parent-form" // Assuming you have parent-specific form styles
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            name="ParentName"
            value={formData.ParentName || ""}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="ParentEmail"
            value={formData.ParentEmail || ""}
            onChange={handleChange}
            placeholder="Email"
            type="email"
          />
          <input
            name="Password"
            value={formData.Password || ""}
            onChange={handleChange}
            placeholder="Password"
            type="password"
          />
          <input
            name="ParentPhoneNo"
            value={formData.ParentPhoneNo || ""}
            onChange={handleChange}
            placeholder="Phone"
            type="number"
          />
          <input
            name="ParentCNIC"
            value={formData.ParentCNIC || ""}
            onChange={handleChange}
            placeholder="CNIC"
            type="number"
          />
          <input
            name="Religion"
            value={formData.Religion || ""}
            onChange={handleChange}
            placeholder="Religion"
          />
          <select
            name="Gender"
            value={formData.Gender || ""}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            {genders.map((gender) => (
              <option key={gender.ID} value={gender.Name}>
                {gender.Name}
              </option>
            ))}
          </select>
          <input
            name="Address"
            value={formData.Address || ""}
            onChange={handleChange}
            placeholder="Address"
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

export default ParentList;
