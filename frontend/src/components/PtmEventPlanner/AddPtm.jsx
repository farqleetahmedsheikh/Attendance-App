/** @format */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addPTM } from "../../redux/ptmSlice";
import { ToastContainer, toast } from "react-toastify";
import { handleAddPTM } from "../../services/Api/handlePostApiFunctions";
// import "./PTM.css";

const AddPTM = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    PTMDate: "",
    Description: "",
    ParentID: null,
    TeacherID: null,
  });

  const [parentOptions, setParentOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const parents = useSelector((state) => state.parents.parents || []);
  const teachers = useSelector((state) => state.teachers.teachers || []);
  useEffect(() => {
    const parentOpts = parents.map((p) => ({
      value: p.ParentID,
      label: p.ParentName,
    }));
    setParentOptions(parentOpts);

    const teacherOpts = teachers.map((t) => ({
      value: t.TeacherID,
      label: t.TeacherName,
    }));
    setTeacherOptions(teacherOpts);
  }, [parents, teachers]); // rerun only if parents or teachers change

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      ParentID: form.ParentID?.value,
      TeacherID: form.TeacherID?.value,
    };

    try {
      const res = handleAddPTM(payload);
      if (!res.ok) throw new Error("Failed to add PTM");

      const data = await res.json();
      const payloadData = {
        PTMID: data.ptm.PTMID,
        PTMDate: data.ptm.PTMDate,
        PTMTime: data.ptm.PTMTime,
        Description: data.ptm.Description,
        ParentID: data.ptm.ParentID,
        TeacherID: data.ptm.TeacherID,
      };
      dispatch(addPTM(payloadData));
      toast.success("PTM added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      // Reset
      setForm({
        PTMDate: "",
        Description: "",
        ParentID: null,
        TeacherID: null,
      });
    } catch (err) {
      toast.error("PTM adding failed!", {
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
      <ToastContainer />
      <form className="student-form" onSubmit={handleSubmit}>
        <input
          name="PTMDate"
          type="date"
          value={form.PTMDate}
          onChange={(e) => setForm({ ...form, PTMDate: e.target.value })}
          required
        />
        <input
          name="PTMTime"
          type="time"
          value={form.PTMTime}
          onChange={(e) => setForm({ ...form, PTMTime: e.target.value })}
          required
        />
        <input
          name="Description"
          placeholder="Description"
          value={form.Description}
          onChange={(e) => setForm({ ...form, Description: e.target.value })}
          required
        />

        <Select
          options={parentOptions}
          value={form.ParentID}
          onChange={(option) => setForm({ ...form, ParentID: option })}
          placeholder="Search Parent..."
          isSearchable
        />

        <Select
          options={teacherOptions}
          value={form.TeacherID}
          onChange={(option) => setForm({ ...form, TeacherID: option })}
          placeholder="Search Teacher..."
          isSearchable
        />
        <button type="submit">Add PTM</button>
      </form>
    </>
  );
};

export default AddPTM;
