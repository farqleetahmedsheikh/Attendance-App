/** @format */

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addClass } from "../../redux/classSlice";
import { ToastContainer, toast } from "react-toastify";
import "./AddClass.css"; // Make sure this contains your .class-form CSS
import { handleAddClass } from "../../services/Api/handlePostApiFunctions";

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
      const res = handleAddClass(formData);
      if (!res.ok) throw new Error("Failed to add class");
      const data = await res.json();
      console.log("Class added:", data);

      // Normalize the ID field (adjust based on your backend response)
      const newClass = {
        ClassName: data.ClassName,
        ClassID: data.ClassID || data._id || data.ID,
      };

      dispatch(addClass(newClass));
      toast.success("Class added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      setFormData({ ClassName: "", Section: "" });
    } catch (error) {
      toast.error("Something went wrong while adding the class.", {
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
    </>
  );
};

export default ClassForm;
