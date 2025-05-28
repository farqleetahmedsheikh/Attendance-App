/** @format */

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSubject } from "../../redux/subjectSlice";
import { ToastContainer, toast } from "react-toastify";
import "./AddSubject.css"; // Assuming you have some styles for the form

const AddSubject = () => {
  const dispatch = useDispatch();
  const classes = useSelector((state) => state.classes || []);
  const [formData, setFormData] = useState({
    SubjectName: "",
    SubjectCode: "",
    ClassID: "",
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
      const res = await fetch("http://localhost:4000/api/subject/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add subject");

      const newSubject = await res.json();

      const subjectToStore = {
        subjectId: newSubject.subjectId,
        SubjectCode: newSubject.SubjectCode,
        SubjectName: newSubject.SubjectName,
        ClassID: newSubject.ClassID,
      };
      dispatch(addSubject(subjectToStore));
      toast.success("Subject added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      setFormData({
        SubjectName: "",
        SubjectCode: "",
        ClassID: "",
      });
    } catch (error) {
      toast.error("Failed to add subject. Try again.", {
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
      <form onSubmit={handleSubmit} className="subject-form">
        <input
          name="SubjectName"
          value={formData.SubjectName}
          onChange={handleChange}
          placeholder="Subject Name"
          required
        />
        <input
          name="SubjectCode"
          value={formData.SubjectCode}
          onChange={handleChange}
          placeholder="Subject Code"
          required
        />
        <select
          name="ClassID"
          value={formData.ClassID}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Class
          </option>
          {classes.map((cls) => (
            <option key={cls.ClassID} value={cls.ClassID}>
              {cls.ClassName}
            </option>
          ))}
        </select>
        <button type="submit">Add Subject</button>
      </form>
    </>
  );
};

export default AddSubject;
