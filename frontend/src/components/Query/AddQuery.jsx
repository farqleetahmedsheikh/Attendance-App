/** @format */
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./AddQuery.css";
import { handleAddQuery } from "../../services/Api/handlePostApiFunctions";

const QueryForm = () => {
  const [formData, setFormData] = useState({
    Subject: "",
    Message: "",
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

    // 🔍 Get role from localStorage (assume it's saved as "userRole")
    const role = localStorage.getItem("role"); // e.g., "Parent" or "Student"

    const userID = localStorage.getItem("userId") || 0;

    // 🔧 Prepare payload based on role
    const payload = {
      Subject: formData.Subject,
      Message: formData.Message,
      role,
      UserID: parseInt(userID),
    };

    try {
      const { ok, data: responseData } = await handleAddQuery(payload);
      if (!ok || ok.error) {
        throw new Error(responseData?.error || "Query submission failed");
      }
      toast.success("Query submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      setFormData({ Subject: "", Message: "" });
    } catch (err) {
      console.error("Query submission error:", err);
      toast.error("Failed to submit query!", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  };

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
