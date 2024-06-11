// controllers/authController.js
const { body, validationResult } = require('express-validator');
const connectionPool = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/user");
const User = require("../models/user");

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
  const validationRules = [
    body('name').notEmpty().withMessage('Name is required').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('username').notEmpty().withMessage('Username is required').isLength({ min: 5 }).withMessage('username must be at least 5 characters long'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format').isLength({ min: 5 }).withMessage('email must be at least 5 characters long'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Name must be at least 5 characters long')
  ];

  await Promise.all(validationRules.map(validation => validation.run(req)));

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
      return res.status(401).json({ message: "Invalid email" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const [userdata] = await connectionPool.query(
      "SELECT username, name FROM users WHERE email = ?",
      [email]
    );
    console.log(userdata[0]);
    const { username, name } = userdata[0];
    console.log(username);
    // Create and sign JWT token
    const token = jwt.sign({userId: user.userId }, process.env.JWT_SECRET);

    res.json({
      message: "Welcome!", 
      user: {name,username,email,token}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.edit = async (req, res) => {
  const {name, username, email, userPhoto } = req.body;
  const userId = 2; // Assuming req.user contains the authenticated user's data

  try {
    console.log({name, username, email, userPhoto,userId });
    const result = await User.edit(userId, name, username, email, userPhoto);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};