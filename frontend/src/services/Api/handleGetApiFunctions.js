/** @format */
import { setClasses } from "../../redux/classSlice";
import { setStudents } from "../../redux/studentSlice";
import { setParents } from "../../redux/parentSlice";
import { setTeachers } from "../../redux/teacherSlice";
import { setSubjects } from "../../redux/subjectSlice";
import { setPTMs } from "../../redux/ptmSlice";

// Remove useDispatch from here and do not call it at the top level

const token = localStorage.getItem("token");
const BASE_URL = "http://localhost:4000/api";

const fetchClasses = async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/class/get-classes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch classes");

    const data = await res.json();
    dispatch(setClasses(data)); // Store classes in Redux
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};

const fetchStudents = async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/student/get-students`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch students");

    const data = await res.json();
    dispatch(setStudents(data)); // Store students in Redux
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

const fetchSubjects = async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/subject/get-subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to fetch subjects");
    const data = await res.json();
    dispatch(setSubjects(data)); // store subjects in redux
  } catch (err) {
    console.error("Error fetching subjects:", err);
  }
};

const fetchTeachers = async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/teacher/get-teachers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to fetch teachers");
    const data = await res.json();
    dispatch(setTeachers(data)); // store teachers in redux
  } catch (err) {
    console.error("Error fetching teachers:", err);
  }
};

const fetchParents = async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/parent/get-parents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch parents");
    const data = await res.json();
    dispatch(setParents(data));
  } catch (error) {
    console.error("Error fetching parents:", error);
  }
};

const fetchPTMs = async (dispatch) => {
  try {
    const res = await fetch(`${BASE_URL}/ptm/get-ptm`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch PTMs");
    const data = await res.json();
    dispatch(setPTMs(data));
  } catch (err) {
    console.error("Error fetching PTMs:", err);
  }
};

const handleGetQueries = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/query/queries`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch queries");

    return await res.json();
  } catch (error) {
    console.error("Error fetching queries:", error);
  }
};

const handleGetUnreadCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/query/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch unread count");

    const data = await res.json();
    return data.unreadCount;
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
};

export {
  fetchClasses,
  fetchStudents,
  fetchSubjects,
  fetchTeachers,
  fetchParents,
  fetchPTMs,
  handleGetQueries,
  handleGetUnreadCount,
};
