/** @format */
import { useSelector, useDispatch } from "react-redux";
import { setPTMs } from "../../redux/ptmSlice";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import Swal from "sweetalert2";
import "./PtmList.css";

Modal.setAppElement("#root"); // Replace with your app root if different

const PTMList = () => {
  const dispatch = useDispatch();
  const ptms = useSelector((state) => state.ptms || []);
  console.log(ptms, "PTMs from Redux");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedID, setSelectedID] = useState(null);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This PTM will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/ptm/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      dispatch(setPTMs(ptms.filter((ptm) => ptm.PTMID !== id)));
      toast.success("PTM deleted");
    } catch {
      toast.error("Failed to delete PTM");
    }
  };

  const openEditModal = (ptm) => {
    setSelectedID(ptm.PTMID);
    setEditForm({
      PTMDate: ptm.PTMDate?.slice(0, 10),
      PTMTime: ptm.PTMTime,
      Description: ptm.Description,
    });
    setModalIsOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/ptm/update/${selectedID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = ptms.map((ptm) =>
        ptm.PTMID === selectedID ? { ...ptm, ...editForm } : ptm
      );
      dispatch(setPTMs(updated));
      toast.success("PTM updated successfully!");
      setModalIsOpen(false);
    } catch {
      toast.error("Failed to update PTM");
    }
  };

  return (
    <div className="ptm-list">
      <ToastContainer />
      <h3>PTM Records</h3>

      {ptms.length === 0 ? (
        <p>No PTMs available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ptms.map((ptm) => (
              <tr key={ptm.PTMID}>
                <td>{new Date(ptm.PTMDate).toISOString().slice(0, 10)}</td>
                <td>{ptm.PTMTime}</td>
                <td>{ptm.Description}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(ptm)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(ptm.PTMID)}
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
        className="ptm-modal"
        overlayClassName="ptm-overlay"
      >
        <h2>Edit PTM</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <label>Date:</label>
          <input
            type="date"
            value={editForm.PTMDate}
            onChange={(e) =>
              setEditForm({ ...editForm, PTMDate: e.target.value })
            }
          />

          <label>Time:</label>
          <input
            type="time"
            value={editForm.PTMTime}
            onChange={(e) =>
              setEditForm({ ...editForm, PTMTime: e.target.value })
            }
          />

          <label>Description:</label>
          <input
            value={editForm.Description}
            onChange={(e) =>
              setEditForm({ ...editForm, Description: e.target.value })
            }
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

export default PTMList;
