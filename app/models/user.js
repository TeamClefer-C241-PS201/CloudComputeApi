// models/user.js
const mysql = require('mysql2/promise');
const connection = require('../config/dbConfig');
const bcrypt = require('bcrypt');
const { use } = require('passport');

class User {
  constructor(userId, googleId, name, username, email, password, photo) {
    this.userId = userId;
    this.googleId = googleId;
    this.name = name;
    this.username = username;
    this.email = email;
    this.password = password;
    this.photo = photo;
  }

  static async create( googleId, name, username, email, password, photo) {
    const hashedPassword = await hashPassword(password); // Implement password hashing
    const [results] = await pool.execute('INSERT INTO users (googleId, name, username, email, password, photo) VALUES (?, ?, ?, ?, ?, ?)', [ googleId, name, username, email, hashedPassword, photo]);
    return new User(results.insertId, googleId, name, username, email, hashedPassword, photo);
  }


  //function on users
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (err) {
      console.error('Error hashing password:', err);
      throw err; // Re-throw for proper error handling
    }
  }
}

User.findOne = async (userData) => {
  const [rows] = await connection.execute('SELECT * FROM users WHERE googleId = ?', [userData.googleId]);
  if (rows.length === 0) return User.create(userData); // User not found
  return new User(rows[0].googleId, rows[0].name); // Return User object
};

User.create = async (userData) => {
  try {
    console.log(userData);
    const sql = 'INSERT INTO users ( googleId, name) VALUES ( :googleId, :name)';
    const params = { googleId: userData.googleId, name: userData.name };
    await connection.execute(sql, params);
    return new User(userData.googleId, userData.name);
  } catch (error) {
    throw error;
  }
};

module.exports = User;
