const token = localStorage.getItem("token");
const BASE_URL = "http://localhost:4000/api";

export const markStudentAttendance = async (formData) => {
  const res = await fetch(`${BASE_URL}/attendance/mark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // optional
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

export const getAttendanceBySubject = async (formData) => {
  const res = await fetch(`${BASE_URL}/attendance/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
    method: "GET",
  });
  const data = await res.json();
  return { ok: res.ok, data };
};
