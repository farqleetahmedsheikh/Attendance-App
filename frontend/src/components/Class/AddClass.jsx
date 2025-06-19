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
      const { ok, data: responseData } = await handleAddClass(formData);
      if (!ok) throw new Error("Failed to add class");
      console.log("Class added:", responseData);

      // Normalize the ID field (adjust based on your backend response)
      const newClass = {
        ClassName: responseData.ClassName,
        ClassID: responseData.ClassID || responseData._id || responseData.ID,
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
      console.error("Error adding class:", error);
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
