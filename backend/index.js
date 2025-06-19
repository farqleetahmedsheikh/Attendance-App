/** @format */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const usersRoute = require("./routes/students"); // Import the student route
const adminRoute = require("./routes/admin"); // Import the admin route
const classRoute = require("./routes/class"); // Import the class route
const subjectRoute = require("./routes/subject"); // Import the class route
const teacherRoute = require("./routes/teacher"); // Import the teacher route
const parentRoute = require("./routes/parent"); // Import the parent route
const ptmRoute = require("./routes/ptm"); // Import the ptm route
const attandenceRoute = require("./routes/attendance"); // Import the attendance route
const connection = require("./connection"); // Import the connection module
const app = express();
const port = process.env.PORT || 4000;
connection; // Call the connection function to establish a connection to the database

app.use(
  cors({
    origin: "http://localhost:5173", // or your frontend's port
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

app.use("/api/admin", adminRoute); // Use the admin route

app.use("/api/student", usersRoute); // Use the users route

app.use("/api/class", classRoute); // Use the class route

app.use("/api/subject", subjectRoute); // Use the Subject route

app.use("/api/teacher", teacherRoute); // Use the Teacher route

app.use("/api/parent", parentRoute); // Use the Parent route

app.use("/api/ptm", ptmRoute); // Use the PTM route

app.use("/api/attendance", attandenceRoute); // Use the PTM route

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
