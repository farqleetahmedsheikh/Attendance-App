/** @format */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudent } from "../../redux/studentSlice";
import "./AddStudent.css";

const StudentForm = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.classes); // ✅ from Redux store

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
    StdImages: "",
    ClassID: "",
    Religion: "",
    Gender: "",
    Address: "",
    GuardianName: "",
  });

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
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/student/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to add student");
      }

      const savedStudent = await res.json();
      dispatch(addStudent(savedStudent)); // ✅ Add to store without refetching
      alert("Student added successfully!");

      // Reset the form
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
        StdImages: "",
        ClassID: "",
        Religion: "",
        Gender: "",
        Address: "",
        GuardianName: "",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
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
      <input
        name="Session"
        value={formData.Session}
        onChange={handleChange}
        placeholder="Session"
      />
      <input
        name="RollNo"
        value={formData.RollNo}
        onChange={handleChange}
        placeholder="Roll No"
      />
      <input
        name="GuardianContact"
        value={formData.GuardianContact}
        onChange={handleChange}
        placeholder="Guardian Contact"
      />
      <input
        name="Password"
        type="password"
        value={formData.Password}
        onChange={handleChange}
        placeholder="Password"
      />
      <input
        name="Type"
        value={formData.Type}
        onChange={handleChange}
        placeholder="Type"
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
            <option key={cls.ClassID || cls._id} value={cls.ClassID || cls._id}>
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
      <input
        name="Gender"
        value={formData.Gender}
        onChange={handleChange}
        placeholder="Gender"
      />
      <input
        name="Address"
        value={formData.Address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        name="GuardianName"
        value={formData.GuardianName}
        onChange={handleChange}
        placeholder="Guardian Name"
      />

      <button type="submit">Add Student</button>
    </form>
  );
};

export default StudentForm;
