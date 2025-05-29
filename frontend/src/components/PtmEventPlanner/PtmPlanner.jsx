/** @format */
import { useState } from "react";

import AddPTM from "./AddPtm";
import PTMList from "./PtmList";
import "./PtmPlanner.css";

const ManagePTM = () => {
  const [activeSection, setActiveSection] = useState("show");

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
