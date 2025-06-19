/** @format */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStudents } from "../../redux/studentSlice";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "./AddStudent.css";
import { handleAddStudent } from "../../services/Api/handlePostApiFunctions";

const StudentForm = () => {
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
  const classes = useSelector((state) => state.classes);
  const students = useSelector((state) => state.students.students);
  const parents = useSelector((state) => state.parents.parents || []);

  const [parentOptions, setParentOptions] = useState([]);
  const [formData, setFormData] = useState({
    Std_Name: "",
    Std_Email: "",
    Std_B_Form: "",
    Std_DOB: "",
    Batch: "",
    Session: "",
    RollNo: "",
    GuardianContact: "",
    Password: "",
    Type: "",
    Status: "Inactive",
    Std_Image: null,
    ClassID: "",
    Religion: "",
    Gender: "",
    Address: "",
    GuardianName: "",
    ParentID: "",
  });

  useEffect(() => {
    const parentOpts = parents.map((p) => ({
      value: p.ParentID,
      label: p.ParentName,
    }));
    setParentOptions(parentOpts);
  }, [parents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      }

      const { ok, data: responseData } = await handleAddStudent(formDataToSend);

      if (!ok) {
        throw new Error(responseData?.error || "Failed to add student");
      }

      dispatch(setStudents([...students, responseData.student]));

      toast.success("Student added successfully!");

      setFormData({
        Std_Name: "",
        Std_Email: "",
        Std_B_Form: "",
        Std_DOB: "",
        Batch: "",
        Session: "",
        RollNo: "",
        GuardianContact: "",
        Password: "",
        Type: "",
        Status: "Inactive",
        Std_Image: null,
        ClassID: "",
        Religion: "",
        Gender: "",
        Address: "",
        GuardianName: "",
        ParentID: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  return (
    <>
      <ToastContainer />
      <form className="student-form" onSubmit={handleSubmit}>
        <input
          name="Std_Name"
          value={formData.Std_Name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="Std_Email"
          value={formData.Std_Email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="Std_B_Form"
          value={formData.Std_B_Form}
          onChange={handleChange}
          placeholder="B-Form"
          type="number"
          required
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
          required
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
          required
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

        <Select
          options={parentOptions}
          value={
            parentOptions.find((opt) => opt.value === formData.ParentID) || null
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

        {/* 📸 Image Upload */}
        <input
          type="file"
          name="Std_Image"
          accept="image/*"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              Std_Image: e.target.files[0],
            }))
          }
        />

        <button type="submit">Add Student</button>
      </form>
    </>
  );
};

export default StudentForm;
