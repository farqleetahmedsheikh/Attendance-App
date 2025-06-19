/** @format */

const token = localStorage.getItem("token");
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
  return data;
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
  return data;
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
  console.log(data);
  return data;
};
export {
  handleAddStudent,
  handleAddTeacher,
  handleAddClass,
  handleAddParent,
  handleAddPTM,
  handleAddSubject,
};
