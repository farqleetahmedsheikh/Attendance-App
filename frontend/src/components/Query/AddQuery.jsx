/** @format */
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "./AddQuery.css";
import { handleAddQuery } from "../../services/Api/handlePostApiFunctions";
import { useSelector } from "react-redux"; // Assuming teachers come from Redux

const QueryForm = () => {
  const [formData, setFormData] = useState({
    Subject: "",
    Message: "",
    TeacherID: null,
  });

  const teachers = useSelector((state) => state.teachers.teachers || []); // ✅ Replace with actual teacher state path
  const role = localStorage.getItem("role");
  const userID = parseInt(localStorage.getItem("userId") || 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectTeacher = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      TeacherID: selectedOption?.value || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.TeacherID) {
      toast.error("Please select a teacher!");
      return;
    }

    const payload = {
      Subject: formData.Subject,
      Message: formData.Message,
      role,
      UserID: userID,
      TeacherID: formData.TeacherID,
    };

    try {
      const { ok, data: responseData } = await handleAddQuery(payload);
      if (!ok || ok.error) {
        throw new Error(responseData?.error || "Query submission failed");
      }

      toast.success("Query submitted successfully!");
      setFormData({ Subject: "", Message: "", TeacherID: null });
    } catch (err) {
      console.error("Query submission error:", err);
      toast.error("Failed to submit query!");
    }
  };

  // Format teacher options for react-select
  const teacherOptions = teachers.map((teacher) => ({
    value: teacher.TeacherID, // Replace with your real teacher field
    label: teacher.TeacherName,
  }));

  return (
    <>
      <ToastContainer />
      <form className="query-form" onSubmit={handleSubmit}>
        <input
          name="Subject"
          value={formData.Subject}
          onChange={handleChange}
          placeholder="Subject"
          required
        />

        <Select
          options={teacherOptions}
          value={teacherOptions.find((opt) => opt.value === formData.TeacherID)}
          onChange={handleSelectTeacher}
          placeholder="Search and select teacher"
          isSearchable
        />

        <textarea
          name="Message"
          value={formData.Message}
          onChange={handleChange}
          placeholder="Write your query or issue here..."
          rows="5"
          required
        />

        <button type="submit">Submit Query</button>
      </form>
    </>
  );
};

export default QueryForm;
