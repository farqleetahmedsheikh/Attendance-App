/** @format */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addClass } from "../../redux/classSlice";
import "./AddClass.css"; // Make sure this contains your .class-form CSS

const ClassForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ClassName: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/class/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add class");
      const data = await res.json();

      // Normalize the ID field (adjust based on your backend response)
      const newClass = {
        ClassName: data.ClassName,
        Section: data.Section,
        id: data.classId || data._id || data.ID,
      };

      dispatch(addClass(newClass));
      alert("Class added successfully!");
      setFormData({ ClassName: "", Section: "" });
    } catch (error) {
      console.error("Error adding class:", error);
      alert("Something went wrong while adding the class.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="class-form">
      <input
        name="ClassName"
        value={formData.ClassName}
        onChange={handleChange}
        placeholder="Class Name"
        required
      />
      <button type="submit">Add Class</button>
    </form>
  );
};

export default ClassForm;
