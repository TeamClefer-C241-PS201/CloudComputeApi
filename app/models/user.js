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
    const sql = 'INSERT INTO users ( googleId, name) VALUES ( :googleId, :name)';
    const params = { googleID: userData.googleID, name: userData.name };
    const [result] = await connection.execute(sql, params);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

module.exports = User;
