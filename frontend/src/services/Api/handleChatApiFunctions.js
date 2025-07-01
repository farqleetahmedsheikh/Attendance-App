/** @format */
const BASE_URL = "http://localhost:4000/api";
const handleAddReply = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/query/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error posting reply:", error);
    return { ok: false, data: { error: "Network error" } };
  }
};

const handleGetQueryThread = async (queryId) => {
  try {
    const response = await fetch(`${BASE_URL}/query/thread/${queryId}`);
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    console.error("Error fetching query thread:", error);
    return { ok: false, data: { error: "Network error" } };
  }
};

export { handleAddReply, handleGetQueryThread };
