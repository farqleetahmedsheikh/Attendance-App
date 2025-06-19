const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Not an admin" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);

    if (err.name === "TokenExpiredError") {
      console.error("Token expired:", err);
      return res.status(401).json({ error: "Token expired" });
    }
    console.error("Invalid token:", err);

    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyAdmin;
