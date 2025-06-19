/** @format */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setParents } from "../../redux/parentSlice";
import { ToastContainer, toast } from "react-toastify";
import "./AddParent.css"; // Assuming you have some styles for the form
import { handleAddParent } from "../../services/Api/handlePostApiFunctions";

const ParentForm = () => {
  const parents = useSelector((state) => state.parents.parents || []);
  const genders = [
    { ID: "1", Name: "Male" },
    { ID: "2", Name: "Female" },
    { ID: "3", Name: "Not to say" },
  ];
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    ParentName: "",
    ParentEmail: "",
    Password: "",
    ParentPhoneNo: "",
    ParentCNIC: "",
    Religion: "",
    Gender: "",
    Address: "",
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
      const res = await handleAddParent(formData); // res is JSON now
      console.log("Response from handleAddParent:", res);

      // ✅ Check for success based on the backend's message or structure
      if (!res || res.error) {
        throw new Error(res.error || "Failed to add parent");
      }
      const parentPayload = {
        ParentID: res.ParentId,
        ParentName: res.ParentName,
        ParentEmail: res.ParentEmail,
        ParentPhoneNo: res.ParentPhoneNo,
        Address: res.Address,
      };
      dispatch(setParents([...parents, parentPayload]));
      toast.success("Parent added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (err) {
      console.error("Error adding parent:", err);
      toast.error("Failed to add parent!", {
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
      <form className="parent-form" onSubmit={handleSubmit}>
        <input
          name="ParentName"
          value={formData.ParentName}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="ParentEmail"
          value={formData.ParentEmail}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
        />
        <input
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
        />
        <input
          name="ParentPhoneNo"
          value={formData.ParentPhoneNo}
          onChange={handleChange}
          placeholder="Phone"
          type="number"
          required
        />
        <input
          name="ParentCNIC"
          value={formData.ParentCNIC}
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
          name="Address"
          value={formData.Address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <button type="submit">Add Parent</button>
      </form>
    </>
  );
};

export default ParentForm;
