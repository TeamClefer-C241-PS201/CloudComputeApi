// models/user.js
const mysql = require('mysql2/promise');
const connection = require('../config/dbConfig')

const User = {};

User.findOne = async (userData) => {
  
  const [rows] = await connection.execute('SELECT * FROM users WHERE ?', [userData.googleId]);
  console.log(userData);
  console.log(rows[0])
  return rows[0];
};

User.create = async (userData) => {
  try {
    console.log(userData);
    const sql = 'INSERT INTO users ( googleId, name) VALUES ( :googleId, :name)';
    const params = { googleId: userData.googleId, name: userData.name, email: userData.email };
    const [result] = await connection.execute(sql, params);
    const createdUser = await connection.execute('SELECT * FROM users WHERE userId = ?', [result.insertId]);
    return createdUser[0];
  } catch (error) {
    throw error;
  }
};

module.exports = User;
