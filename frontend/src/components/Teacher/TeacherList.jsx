/** @format */
import { useDispatch, useSelector } from "react-redux";
import { setTeachers } from "../../redux/teacherSlice"; // Correct import
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-modal";
import "./TeacherList.css";

Modal.setAppElement("#root");

const TeacherList = () => {
  const teachers = useSelector((state) => state.teachers?.teachers || []);
  const subjects = useSelector((state) => state.subjects || []);
  const classes = useSelector((state) => state.classes);
  const dispatch = useDispatch();
  const genders = [
    { ID: "1", Name: "Male" },
    { ID: "2", Name: "Female" },
    { ID: "3", Name: "Not to say" },
  ];
  const types = [
    { ID: "1", Name: "Regular" },
    { ID: "2", Name: "Visitor" },
  ];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedSubjectIDs, setSelectedSubjectIDs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedSubjectIDs(selectedOptions);
    setFormData((prev) => ({
      ...prev,
      SubjectIDs: selectedOptions,
    }));
  };

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

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Teacher?", // Correct title
      text: "Are you sure you want to delete this teacher?", // Correct text
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
        `http://localhost:4000/api/teacher/delete/${id}`, // Correct endpoint
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete teacher"); // Correct message

      dispatch(setTeachers(teachers.filter((t) => t.TeacherID !== id))); // Correct dispatch
      toast.success("Teacher deleted successfully!"); // Correct message
    } catch {
      toast.error("Failed to delete teacher."); // Correct message
    }
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      ...teacher,
      SubjectIDs: teacher.SubjectIDs || [],
    });
    setSelectedSubjectIDs(
      teacher.SubjectIDs ? teacher.SubjectIDs.map(String) : []
    );
    setModalIsOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/teacher/update/${
          selectedTeacher.TeacherID || selectedTeacher._id
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

      if (!res.ok) throw new Error("Failed to update teacher"); // Correct message

      const updatedList = teachers.map((t) =>
        t.TeacherID === (selectedTeacher.TeacherID || selectedTeacher._id) ||
        t._id === (selectedTeacher.TeacherID || selectedTeacher._id)
          ? { ...t, ...formData }
          : t
      );
      dispatch(setTeachers(updatedList)); // Correct dispatch
      toast.success("Teacher updated successfully!"); // Correct message
      setModalIsOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update teacher."); // Correct message
    }
  };

  return (
    <div className="teacher-list">
      <ToastContainer />
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
              <th>Actions</th> {/* Added Actions column */}
            </tr>
          </thead>
          <tbody>
            {teachers.map((t) => (
              <tr key={t.TeacherID || t._id}>
                <td>{t.TeacherName}</td>
                <td>{t.TeacherEmail}</td>
                <td>{t.TeacherPhoneNo}</td>
                <td>{getSubjectDetails(t.SubjectIDs)}</td>
                <td>
                  <button onClick={() => openEditModal(t)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.TeacherID || t._id)}
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
        contentLabel="Edit Teacher" // Correct label
        preventScroll={false}
        className="ptm-modal"
        overlayClassName="ptm-overlay"
      >
        <h2>Edit Teacher</h2> {/* Correct heading */}
        <form
          className="teacher-form" // Assuming you have teacher-specific form styles
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            name="TeacherName"
            value={formData.TeacherName || ""}
            onChange={handleChange}
            placeholder="Teacher Name"
            
          />
          <input
            name="TeacherEmail"
            value={formData.TeacherEmail || ""}
            onChange={handleChange}
            placeholder="Teacher Email"
            type="email"
            
          />
          <input
            name="Password"
            type="password"
            value={formData.Password || ""}
            onChange={handleChange}
            placeholder="Password"
          />
          <input
            name="TeacherDOB"
            type="date"
            value={formData.TeacherDOB ? formData.TeacherDOB.slice(0, 10) : ""}
            onChange={handleChange}
            
          />
          <input
            name="TeacherPhoneNo"
            value={formData.TeacherPhoneNo || ""}
            onChange={handleChange}
            placeholder="Phone Number"
            type="number"
            
          />
          <select
            name="TeacherType"
            value={formData.TeacherType || ""}
            onChange={handleChange}
            
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.ID} value={type.Name}>
                {type.Name}
              </option>
            ))}
          </select>
          <input
            name="TeacherCNIC"
            value={formData.TeacherCNIC || ""}
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
            className="full-width"
            name="Address"
            value={formData.Address || ""}
            onChange={handleChange}
            placeholder="Address"
            
          />

          <label className="full-width" htmlFor="subject-select">
            Subjects (Select multiple with Ctrl/Cmd):
          </label>
          <select
            id="subject-select"
            multiple
            value={selectedSubjectIDs}
            onChange={handleSubjectChange}
            
          >
            {Array.isArray(subjects) &&
              subjects.map((subj) => (
                <option
                  key={subj.SubjectID || subj._id}
                  value={subj.SubjectID || subj._id}
                >
                  {subj.SubjectName} - {subj.SubjectCode} -{" "}
                  {getClassName(subj.ClassID)}
                </option>
              ))}
          </select>

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

export default TeacherList;
