// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // 🔁 change to your MySQL username
  password: '', // 🔁 and password
  database: 'attandence_app' // 🔁 change to your database name
});

connection.connect(err => {
  if (err) {
    console.error('❌ Connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL!');
});

module.exports = connection;
