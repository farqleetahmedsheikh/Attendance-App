/** @format */
import { useSelector } from "react-redux";
// import "./PTM.css";

const PTMList = () => {
  const ptms = useSelector((state) => state.ptms || []);
console.log("PTMs from Redux:", ptms); // Debugging line to check PTM data
  return (
    <div className="student-list">
      <h3>PTM Records</h3>
      {ptms.length === 0 ? (
        <p>No PTMs found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {ptms.map((ptm, index) => (
              <tr key={index}>
                <td>{new Date(ptm.PTMDate).toISOString().slice(0, 10)}</td>
                <td>{ptm.PTMTime}</td>
                <td>{ptm.Description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PTMList;
