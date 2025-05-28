const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRoute = require("./routes/students"); // Import the users route
const adminRoute = require("./routes/admin"); // Import the admin route
const classRoute = require("./routes/class"); // Import the class route
const subjectRoute = require("./routes/subject"); // Import the class route
const teacherRoute = require("./routes/teacher"); // Import the class route
const connection = require("./connection"); // Import the connection module
const verifyAdmin = require("./middleware/auth"); // Import the auth middleware
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

app.use("/api/admin", adminRoute); // Use the admin route

app.use("/api/student", verifyAdmin, usersRoute); // Use the users route

app.use("/api/class", verifyAdmin, classRoute); // Use the class route

app.use("/api/subject", verifyAdmin, subjectRoute); // Use the Subject route

app.use("/api/teacher", verifyAdmin, teacherRoute); // Use the Teacher route

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
