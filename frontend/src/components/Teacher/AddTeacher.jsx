/** @format */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeacher } from "../../redux/teacherSlice";
import "./AddTeacher.css";

const TeacherForm = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.teachers?.subjects || []);
  const classes = useSelector((state) => state?.classes || []);
  // Convert ClassID to readable name
  const getClassName = (id) => {
    const cls = classes.find((c) => c.ClassID === id || c._id === id);
    return cls ? cls.ClassName : "Unknown";
  };

  const [formData, setFormData] = useState({
    TeacherName: "",
    TeacherEmail: "",
    Password: "",
    TeacherDOB: "",
    TeacherPhoneNo: "",
    TeacherStatus: "",
    TeacherType: "",
    TeacherCNIC: "",
    Religion: "",
    Gender: "",
    Address: "",
    SubjectID: [], // array of selected subject IDs
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e) => {
    // Multi-select subjects, e.target.selectedOptions is a HTMLCollection
    const selected = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
    );
    setFormData((prev) => ({
      ...prev,
      SubjectID: selected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/teacher/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add teacher");
      }

      const savedTeacher = await res.json();
      dispatch(addTeacher(savedTeacher.teacher)); // add to redux store
      alert("Teacher added successfully!");

      setFormData({
        TeacherName: "",
        TeacherEmail: "",
        Password: "",
        TeacherDOB: "",
        TeacherPhoneNo: "",
        TeacherStatus: "",
        TeacherType: "",
        TeacherCNIC: "",
        Religion: "",
        Gender: "",
        Address: "",
        SubjectID: [],
      });
    } catch (error) {
      console.error("Error adding teacher:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="teacher-form" onSubmit={handleSubmit}>
      <input
        name="TeacherName"
        value={formData.TeacherName}
        onChange={handleChange}
        placeholder="Teacher Name"
        required
      />
      <input
        name="TeacherEmail"
        value={formData.TeacherEmail}
        onChange={handleChange}
        placeholder="Teacher Email"
        type="email"
        required
      />
      <input
        name="Password"
        type="password"
        value={formData.Password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        name="TeacherDOB"
        type="date"
        value={formData.TeacherDOB}
        onChange={handleChange}
        required
      />
      <input
        name="TeacherPhoneNo"
        value={formData.TeacherPhoneNo}
        onChange={handleChange}
        placeholder="Phone Number"
        required
      />
      <input
        name="TeacherStatus"
        value={formData.TeacherStatus}
        onChange={handleChange}
        placeholder="Status"
        required
      />
      <input
        name="TeacherType"
        value={formData.TeacherType}
        onChange={handleChange}
        placeholder="Type"
        required
      />
      <input
        name="TeacherCNIC"
        value={formData.TeacherCNIC}
        onChange={handleChange}
        placeholder="CNIC"
        required
      />
      <input
        name="Religion"
        value={formData.Religion}
        onChange={handleChange}
        placeholder="Religion"
        required
      />
      <input
        name="Gender"
        value={formData.Gender}
        onChange={handleChange}
        placeholder="Gender"
        required
      />
      <input
        className="full-width"
        name="Address"
        value={formData.Address}
        onChange={handleChange}
        placeholder="Address"
        required
      />

      <label className="full-width" htmlFor="subject-select">
        Subjects (Select multiple with Ctrl/Cmd):
      </label>
      <select
        id="subject-select"
        multiple
        value={formData.SubjectID.map(String)} // value must be string array
        onChange={handleSubjectChange}
        required
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

      <button type="submit">Add Teacher</button>
    </form>
  );
};

export default TeacherForm;
