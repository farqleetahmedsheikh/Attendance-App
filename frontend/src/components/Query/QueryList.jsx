/** @format */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./QueryList.css";
import {
  handleGetQueries,
  handleGetUnreadCount,
} from "../../services/Api/handleGetApiFunctions";
import { handlePutRead } from "../../services/Api/handlePostApiFunctions";

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const students = useSelector((state) => state.students.students || []);
  const parents = useSelector((state) => state.parents.parents || []);

  useEffect(() => {
    const fetchQueriesAndMarkRead = async () => {
      const queryData = await handleGetQueries();
      if (queryData) setQueries(queryData);

      const countData = await handleGetUnreadCount();
      if (countData !== undefined) setUnreadCount(countData);

      await handlePutRead(); // Mark queries as read
    };

    fetchQueriesAndMarkRead();
  }, []);

  // Helper functions to get names and emails
  const getStudentInfo = (id) => {
    const student = students.find((s) => s.Std_ID === id);
    return student ? `${student.Std_Name} (${student.Std_Email})` : "-";
  };

  const getParentInfo = (id) => {
    const parent = parents.find((p) => p.ParentID === id);
    return parent ? `${parent.ParentName} (${parent.ParentEmail})` : "-";
  };

  return (
    <div className="query-list">
      <h3>
        All Queries <span className="query-badge">Unread: {unreadCount}</span>
      </h3>
      {queries.length === 0 ? (
        <p>No queries found.</p>
      ) : (
        <table className="query-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Student</th>
              <th>Parent</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <tr
                key={query.QueryID}
                className={query.Status === "Unread" ? "unread-row" : ""}
              >
                <td>{index + 1}</td>
                <td>{query.Subject}</td>
                <td>{query.Message}</td>
                <td>{getStudentInfo(query.StudentID)}</td>
                <td>{getParentInfo(query.ParentID)}</td>
                <td>{query.Status}</td>
                <td>{new Date(query.CreatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QueryList;
