// controllers/authController.js
const { validationResult } = require("express-validator");
const connectionPool = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/user");

exports.logout = (req, res) => {
  req.logout();
  res.json({ message: "Logged out" });
  res.redirect("/");
};

exports.googleCallback = (req, res) => {
  // res.json({ message: 'Authentication successful', user: req.user });
  res.redirect("/");
};

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, password } = req.body;

  try {
    await connectionPool.getConnection();

    const existingUser = await connectionPool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser[0].length > 0) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connectionPool.query(
      "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)",
      [name, username, email, hashedPassword]
    );

    res
      .status(201)
      .json({
        message: "User created successfully",
        user: { username, email },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }

  
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const userData = await connectionPool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    // Create and sign JWT token
    const payload = { userId: user.userId }; // Include user ID in payload
    const token = jwt.sign(payload, "your_secret_key", { expiresIn: "1h" });

    res.json({ email,token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};