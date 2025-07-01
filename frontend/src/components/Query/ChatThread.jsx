/** @format */
import { useEffect, useState } from "react";
import "./ChatThread.css";
import {
  handleAddReply,
  handleGetQueryThread,
} from "../../services/Api/handleChatApiFunctions"; // Create these API functions

const ChatThread = ({ query }) => {
  const [replies, setReplies] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const role = localStorage.getItem("role");
  const queryId = query.QueryID;

  const fetchReplies = async () => {
    console.log("Fetching replies for query ID:", queryId);
    const result = await handleAddReply(Number(queryId));
    console.log("Fetched replies:", result);
    if (result) setReplies(result);
  };

  useEffect(() => {
    const fetchReplies = async () => {
      const { ok, data } = await handleGetQueryThread(query.QueryID); // ✅ correct function to get thread
      if (ok && Array.isArray(data)) {
        setReplies(data);
      } else {
        console.error("Failed to fetch replies", data);
      }
    };

    fetchReplies();
  }, [query.QueryID]);

  const sendReply = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      QueryID: queryId,
      SenderID: parseInt(localStorage.getItem("userId") || 0),
      SenderRole: role,
      Message: newMessage,
    };

    const { ok } = await handleAddReply(payload);
    if (ok) {
      setNewMessage("");
      fetchReplies();
    }
  };

  return (
    <div className="chat-thread">
      <h4>Conversation</h4>
      <div className="chat-box">
        {replies.map((reply) => (
          <div
            key={reply.ReplyID}
            className={`chat-bubble ${reply.SenderRole.toLowerCase()}`}
          >
            <p>{reply.Message}</p>
            <small>{new Date(reply.CreatedAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a reply..."
        />
        <button onClick={sendReply}>Send</button>
      </div>
    </div>
  );
};

export default ChatThread;
