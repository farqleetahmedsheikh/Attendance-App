/** @format */

import { useState } from "react";
import AddQuery from "./AddQuery"; // A form component to send query
import QueryList from "./QueryList"; // A list component to display all queries
import "./Query.css"; // Custom styling

const ManageQuery = () => {
  const [activeSection, setActiveSection] = useState("show");
  const role = localStorage.getItem("role");

  return (
    <div className="manage-container">
      <h2>Manage Queries</h2>
      <div className="dropdowns">
        {role === "parent" && (
          <button
            className={activeSection === "add" ? "active" : ""}
            onClick={() => setActiveSection("add")}
          >
            Add Query
          </button>
        )}
        <button
          className={activeSection === "show" ? "active" : ""}
          onClick={() => setActiveSection("show")}
        >
          Show All Queries
        </button>
      </div>

      <div className="section-content">
        {role === "parent" && activeSection === "add" ? (
          <div className="add-query">
            <AddQuery />
          </div>
        ) : (
          <div className="show-query">
            <QueryList />
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuery;
