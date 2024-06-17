// models/user.js
const mysql = require("mysql2/promise");
const connection = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
const { use } = require("passport");
const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const { bucket } = require('../config/storage');

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

  static async create(googleId, name, username, email, password, photo) {
    const hashedPassword = await hashPassword(password); // Implement password hashing
    const [results] = await pool.execute(
      "INSERT INTO users (googleId, name, username, email, password, userPhoto) VALUES (?, ?, ?, ?, ?, ?)",
      [googleId, name, username, email, hashedPassword, userPhoto]
    );
    return new User(
      results.insertId,
      googleId,
      name,
      username,
      email,
      hashedPassword,
      userPhoto
    );
  }

  //function on users
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (err) {
      console.error("Error hashing password:", err);
      throw err; // Re-throw for proper error handling
    }
  }
}
User.getUserByEmail = async (email) => {
  const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

User.getData = async(userId) => {
  try{
  const [rows] = await connection.execute("SELECT userId, name, username, email, userPhoto From users WHERE userId = ?",
    [userId
  ]);
  return rows[0];
  }catch (err) {
    console.error("Error getting userData:", err);
    throw err; 
  }
};

User.findOne = async (userData) => {
  const [rows] = await connection.execute(
    "SELECT * FROM users WHERE googleId = ?",
    [userData.googleId]
  );
  if (rows.length === 0) return User.create(userData);
  return new User(rows[0].userId, rows[0].googleId, rows[0].name);
};

User.create = async (userData) => {
  try {
    console.log(userData);
    const sql =
      "INSERT INTO users ( googleId, name,email) VALUES ( :googleId, :name, :email)";
    const params = { googleId: userData.googleId, name: userData.name, email:userData.email };
    await connection.execute(sql, params);
    return User.findOne(userData);
  } catch (error) {
    throw error;
  }
};

User.edit = async (userId, name, username, email, userPhoto) => {
  try {
    // Ensure optional parameters are defaulted to null if not provided
    name = name || null;
    username = username || null;
    email = email || null;
    userPhoto = userPhoto || null;

    const query = `
      UPDATE users 
      SET name = ?, username = ?, email = ?, userPhoto = ?
      WHERE userId = ?
    `;
    const [result] = await connection.execute(query, [name, username, email, userPhoto, userId]);
    
    return result; // Return the result of the update operation
  } catch (error) {
    throw error;
  }
};

User.uploadPhoto = async (userId, file) => {
  try {
    const blob = bucket.file(`profilePhoto/${userId}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      }).on('error', (err) => {
        reject(err);
      }).end(file.buffer);
    });
  } catch (error) {
    throw error;
  }
};

module.exports = User;
