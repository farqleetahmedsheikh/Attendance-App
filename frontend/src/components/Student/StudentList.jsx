/** @format */
import { useSelector, useDispatch } from "react-redux";
import { setStudents } from "../../redux/studentSlice";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "react-modal";
import Select from "react-select";
import "./StudentList.css";
import "./AddStudent.css";

Modal.setAppElement("#root");

const StudentList = () => {
  const genders = [
    { ID: "1", Name: "Male" },
    { ID: "2", Name: "Female" },
    { ID: "3", Name: "Not to say" },
  ];
  const sessions = [
    { ID: "1", Name: "Morning" },
    { ID: "2", Name: "Evening" },
  ];
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.students);
  const parents = useSelector((state) => state.parents.parents || []);
  const classes = useSelector((state) => state.classes);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [parentOptions, setParentOptions] = useState([]);

  useEffect(() => {
    const options = parents.map((p) => ({
      value: p.ParentID,
      label: p.ParentName,
    }));
    setParentOptions(options);
  }, [parents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getClassName = (id) => {
    const cls = classes.find((c) => c.ClassID === id || c._id === id);
    return cls ? cls.ClassName : "Unknown";
  };

  const getParentDetails = (id) => {
    const parent = parents.find((p) => p.ParentID === id);
    return parent
      ? `${parent.ParentName} (${parent.ParentPhoneNo})`
      : "No Parent Linked";
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Student?",
      text: "Are you sure you want to delete this student?",
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
        `http://localhost:4000/api/student/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete student");

      dispatch(setStudents(students.filter((s) => s.Std_ID !== id)));
      toast.success("Student deleted successfully!");
    } catch {
      toast.error("Failed to delete student.");
    }
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      ...student,
      ParentID: student.ParentID || "",
    });
    setModalIsOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/student/update/${selectedStudent.Std_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update student");

      const updatedList = students.map((s) =>
        s.Std_ID === selectedStudent.Std_ID ? { ...s, ...formData } : s
      );
      dispatch(setStudents(updatedList));
      toast.success("Student updated successfully!");
      setModalIsOpen(false);
    } catch {
      toast.error("Failed to update student.");
    }
  };

  return (
    <div className="student-list">
      <ToastContainer />
      <h3>Registered Students</h3>
      {students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>SR</th>
              <th>Name</th>
              <th>Email</th>
              <th>Roll No</th>
              <th>Gender</th>
              <th>Class</th>
              <th>Parent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.Std_ID || index}>
                <td>{index + 1}</td>
                <td>{student.Std_Name}</td>
                <td>{student.Std_Email}</td>
                <td>{student.RollNo}</td>
                <td>{student.Gender}</td>
                <td>{getClassName(student.ClassID)}</td>
                <td>{getParentDetails(student.ParentID)}</td>
                <td>
                  <button
                    onClick={() => openEditModal(student)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.Std_ID)}
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
        contentLabel="Edit Student"
        preventScroll={false}
        className="ptm-modal"
        overlayClassName="ptm-overlay"
      >
        <h2>Edit Student</h2>
        <form
          className="student-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <input
            name="Std_Name"
            value={formData.Std_Name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="Std_Email"
            value={formData.Std_Email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            name="Std_B_Form"
            value={formData.Std_B_Form}
            onChange={handleChange}
            placeholder="B-Form"
            type="number"
          />
          <input
            name="Std_DOB"
            type="date"
            value={formData.Std_DOB}
            onChange={handleChange}
          />
          <input
            name="Batch"
            value={formData.Batch}
            onChange={handleChange}
            placeholder="Batch"
          />
          <select
            name="Session"
            value={formData.Session}
            onChange={handleChange}
          >
            <option value="">Select Session</option>
            {sessions.map((session) => (
              <option key={session.ID} value={session.Name}>
                {session.Name}
              </option>
            ))}
          </select>
          <input
            name="RollNo"
            value={formData.RollNo}
            onChange={handleChange}
            placeholder="Roll No"
          />
          <input
            name="Password"
            type="password"
            value={formData.Password}
            onChange={handleChange}
            placeholder="Password"
          />
          <select
            name="ClassID"
            value={formData.ClassID}
            onChange={handleChange}
          >
            <option value="">Select Class</option>
            {Array.isArray(classes) &&
              classes.map((cls) => (
                <option
                  key={cls.ClassID || cls._id}
                  value={cls.ClassID || cls._id}
                >
                  Class {cls.ClassName}
                </option>
              ))}
          </select>

          <input
            name="Religion"
            value={formData.Religion}
            onChange={handleChange}
            placeholder="Religion"
          />
          <select name="Gender" value={formData.Gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            {genders.map((gender) => (
              <option key={gender.ID} value={gender.Name}>
                {gender.Name}
              </option>
            ))}
          </select>
          <Select
            options={parentOptions}
            value={
              parentOptions.find((opt) => opt.value === formData.ParentID) ||
              null
            }
            onChange={(option) =>
              setFormData((prev) => ({
                ...prev,
                ParentID: option ? option.value : "",
              }))
            }
            placeholder="Search Parent..."
            isSearchable
          />
          <input
            name="Address"
            value={formData.Address}
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

export default StudentList;
