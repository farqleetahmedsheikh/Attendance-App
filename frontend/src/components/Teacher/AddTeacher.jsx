/** @format */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeacher } from "../../redux/teacherSlice";
import { ToastContainer, toast } from "react-toastify";
import { handleAddTeacher } from "../../services/Api/handlePostApiFunctions";
import "./AddTeacher.css";

const TeacherForm = () => {
  const dispatch = useDispatch();
  const subjects = useSelector((state) => state.subjects || []);
  const classes = useSelector((state) => state?.classes || []);

  const genders = [
    { ID: "1", Name: "Male" },
    { ID: "2", Name: "Female" },
    { ID: "3", Name: "Not to say" },
  ];
  const types = [
    { ID: "1", Name: "Regular" },
    { ID: "2", Name: "Visitor" },
  ];
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
      const res = handleAddTeacher(formData);
      if (!res.ok) {
        throw new Error("Failed to add teacher");
      }

      const savedTeacher = await res.json();
      dispatch(addTeacher(savedTeacher.teacher)); // add to redux store
      toast.success("Teacher added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

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
      toast.error("Failed to add teacher", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <>
      {" "}
      <ToastContainer />
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
          type="number"
          required
        />
        <select
          name="TeacherType"
          value={formData.TeacherType}
          onChange={handleChange}
          required
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
          value={formData.TeacherCNIC}
          onChange={handleChange}
          placeholder="CNIC"
          type="number"
          required
        />
        <input
          name="Religion"
          value={formData.Religion}
          onChange={handleChange}
          placeholder="Religion"
          required
        />
        <select
          name="Gender"
          value={formData.Gender}
          onChange={handleChange}
          required
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
    </>
  );
};

export default TeacherForm;
