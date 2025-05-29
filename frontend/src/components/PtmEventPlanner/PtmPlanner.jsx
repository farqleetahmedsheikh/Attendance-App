/** @format */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPTMs } from "../../redux/ptmSlice";
import AddPTM from "./AddPtm";
import PTMList from "./PtmList";
import "./PtmPlanner.css";

const ManagePTM = () => {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("show");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchPTMs = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/ptm/get-ptm", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch PTMs");
        const data = await res.json();
        console.log(data , "PTMs fetched successfully");
        dispatch(setPTMs(data));
      } catch (err) {
        console.error("Error fetching PTMs:", err);
      }
    };

    fetchPTMs();
  }, [dispatch]);

  return (
    <div className="manage-container">
      <h2>Manage PTMs</h2>
      <div className="dropdowns">
        <button
          className={activeSection === "add" ? "active" : ""}
          onClick={() => setActiveSection("add")}
        >
          Add PTM
        </button>
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All PTMs
        </button>
      </div>
      <div className="section-content">
        {activeSection === "add" ? (
          <div className="add-student">
            <AddPTM />
          </div>
        ) : (
          <div className="show-student">
            <PTMList />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePTM;
