/** @format */
import { useSelector, useDispatch } from "react-redux";
import { setClasses } from "../../redux/classSlice"; // Import the correct action
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "./ListClass.css";

const ClassList = () => {
  const classesData = useSelector((state) => state.classes || []);
  const classes = classesData.classes || [];
  const dispatch = useDispatch();

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Class?",
      text: "Are you sure you want to delete this class?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/class/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete class");
      const NewClasses = classes.filter(
        (cls) => cls.ClassID !== id || cls._id !== id
      );
      console.log("NewClasses:", NewClasses);
      dispatch(setClasses(NewClasses)); // Update Redux store
      toast.success("Class deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete class.");
    }
  };

  return (
    <div className="class-list">
      <ToastContainer />
      <h3>Registered Classes</h3>
      {classesData.length === 0 ? (
        <p>No classes available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classesData.map((cls) => (
              <tr key={cls.ClassID || cls._id}>
                <td data-label="Class Name">{cls.ClassName}</td>
                <td>
                  <button
                    onClick={() => handleDelete(cls.ClassID || cls._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClassList;
