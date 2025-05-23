import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ role }) => {
  const navigate = useNavigate();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:4000/api/${role}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: Email.trim().toLowerCase(),
        Password: Password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`${role} login successful`);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login as {role}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={Email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={Password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
        <div style={{ marginTop: "15px" }}>
          <Link to="/forgot-password">Forget Password</Link>
          <span style={{ margin: "0 10px" }}>|</span>
          <Link to="/">Back to Home</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
