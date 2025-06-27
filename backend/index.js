/** @format */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const usersRoute = require("./routes/students");
const adminRoute = require("./routes/admin");
const classRoute = require("./routes/class");
const subjectRoute = require("./routes/subject");
const teacherRoute = require("./routes/teacher");
const parentRoute = require("./routes/parent");
const ptmRoute = require("./routes/ptm");
const queryRoute = require("./routes/query");
const attandenceRoute = require("./routes/attendance");
const connection = require("./connection");

const app = express();
const port = process.env.PORT || 4000;

// Establish database connection
connection;

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Correct image access for students
app.use("/student-images", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/admin", adminRoute);
app.use("/api/student", usersRoute);
app.use("/api/class", classRoute);
app.use("/api/subject", subjectRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/parent", parentRoute);
app.use("/api/ptm", ptmRoute);
app.use("/api/query", queryRoute);
app.use("/api/attendance", attandenceRoute);

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
