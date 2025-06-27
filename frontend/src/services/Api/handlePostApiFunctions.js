/** @format */

const token = localStorage.getItem("token");
console.log("Token:", token); // Debugging line to check if token is retrieved
const BASE_URL = "http://localhost:4000/api";

const handleAddTeacher = async (formData) => {
  const res = await fetch(`${BASE_URL}/teacher/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

const handleAddStudent = async (formData) => {
  const res = await fetch(`${BASE_URL}/student/add`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // DO NOT set Content-Type manually for FormData
    },
    body: formData,
  });

  const data = await res.json();

  return { ok: res.ok, status: res.status, data };
};

const handleAddClass = async (formData) => {
  const res = await fetch(`${BASE_URL}/class/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();

  return { ok: res.ok, status: res.status, data };
};

const handleAddParent = async (formData) => {
  const res = await fetch(`${BASE_URL}/parent/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return data;
};

const handleAddPTM = async (formData) => {
  const res = await fetch(`${BASE_URL}/ptm/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

const handleAddSubject = async (formData) => {
  const res = await fetch(`${BASE_URL}/subject/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return data;
};

const handleAddQuery = async (formData) => {
  const res = await fetch(`${BASE_URL}/query/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
};

const handlePutRead = async () => {
  try {
    const res = await fetch(`${BASE_URL}/query/mark-read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to mark queries as read");
    return await res.json(); // optional: return message
  } catch (error) {
    console.error("Error marking queries as read:", error);
  }
};
export {
  handleAddStudent,
  handleAddTeacher,
  handleAddClass,
  handleAddParent,
  handleAddPTM,
  handleAddSubject,
  handleAddQuery,
  handlePutRead,
};
