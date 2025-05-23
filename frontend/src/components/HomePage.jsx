import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  const data = {
    admin: {
      title: "Admin",
      description: "Manage system users and monitor data.",
    },
    teacher: {
      title: "Teacher",
      description: "Manage attendance, subjects and student data.",
    },
    student: {
      title: "Student",
      description: "Check attendance, notices and updates.",
    },
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Portal</h1>
      <h3>Manage your everything through a single portal</h3>
      <div className="card-wrapper">
        {Object.entries(data).map(([role, { title, description }]) => (
          <div className="card" key={role}>
            <h2>{title}</h2>
            <p>{description}</p>
            <button onClick={() => navigate(`/login/${role}`)}>
              Login as {title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
