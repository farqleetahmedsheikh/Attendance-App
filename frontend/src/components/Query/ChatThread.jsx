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
    const { ok, data } = await handleGetQueryThread(Number(queryId)); // ✅ CORRECT FUNCTION

    console.log("Fetched replies:", data);

    if (ok && Array.isArray(data)) {
      setReplies(data);
    } else {
      console.error("Failed to fetch replies", data);
    }
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
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const userId = parseInt(localStorage.getItem("userId"), 10);
    if (!userId || isNaN(userId)) {
      console.error("Invalid or missing userId in localStorage");
      return;
    }

    const payload = {
      QueryID: queryId,
      SenderID: userId,
      SenderRole: role,
      Message: trimmedMessage,
    };

    try {
      const { ok, data } = await handleAddReply(payload);

      if (ok) {
        setNewMessage("");
        fetchReplies(); // Refresh thread
      } else {
        console.error("Reply failed:", data?.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
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
