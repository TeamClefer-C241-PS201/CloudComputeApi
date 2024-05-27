const mysql = require('mysql2/promise');
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const User = {};

User.findOne = async (condition) => {
  const [rows] = await connection.execute('SELECT * FROM users WHERE ?', [condition]);
  return rows[0];
};

User.create = async
