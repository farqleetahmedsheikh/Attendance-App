/** @format */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./QueryList.css";
import {
  handleGetQueries,
  handleGetUnreadCount,
} from "../../services/Api/handleGetApiFunctions";
import { handlePutRead } from "../../services/Api/handlePostApiFunctions";
import ChatThread from "./ChatThread"; // Import your chat component

const QueryList = () => {
  const [queries, setQueries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openQueryId, setOpenQueryId] = useState(null); // 👈 track open conversation

  const students = useSelector((state) => state.students.students || []);
  const parents = useSelector((state) => state.parents.parents || []);

  const userId = parseInt(localStorage.getItem("userId") || 0);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchQueriesAndMarkRead = async () => {
      const queryData = await handleGetQueries();
      if (queryData) {
        let filtered = [];

        if (role === "teacher") {
          filtered = queryData.filter((q) => q.TeacherID === userId);
        } else if (role === "parent") {
          filtered = queryData.filter((q) => q.ParentID === userId);
        }

        setQueries(filtered);
      }

      const countData = await handleGetUnreadCount();
      if (countData !== undefined) setUnreadCount(countData);

      await handlePutRead(); // Mark all as read
    };

    fetchQueriesAndMarkRead();
  }, [role, userId]);

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
        My Queries <span className="query-badge">Unread: {unreadCount}</span>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query, index) => (
              <>
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
                  <td>
                    <button
                      onClick={() =>
                        setOpenQueryId((prev) =>
                          prev === query.QueryID ? null : query.QueryID
                        )
                      }
                    >
                      {openQueryId === query.QueryID ? "Hide" : "View Chat"}
                    </button>
                  </td>
                </tr>

                {openQueryId === query.QueryID && (
                  <tr>
                    <td colSpan="8">
                      <ChatThread query={query} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QueryList;
