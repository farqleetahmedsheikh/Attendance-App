/** @format */
import { useSelector } from "react-redux";
import "./ParentList.css"; // Make sure this file exists

const ParentList = () => {
  const parents = useSelector((state) => state.parents || []);
  const ParentList = parents.parents || [];
  if (Array.isArray(parents)) {
    return <p className="error">Error: Invalid parent data format.</p>;
  }
  return (
    <div className="parent-list">
      <h3>Parent List</h3>
      {ParentList.length === 0 ? (
        <p className="no-data">No parents added yet.</p>
      ) : (
        <table className="parent-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {ParentList.map((p) => (
              <tr key={p.ParentID || p._id}>
                <td>{p.ParentName}</td>
                <td>{p.ParentEmail}</td>
                <td>{p.ParentPhoneNo}</td>
                <td>{p.Address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ParentList;
