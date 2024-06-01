// controllers/authController.js
const User = require('../models/user');
const { validationResult } = require('express-validator');
const connectionPool = require('../config/dbConfig');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    res.send('Login with Google at /auth/google');
  };
  
  exports.logout = (req, res) => {
    req.logout();
    res.json({ message: 'Logged out' });
  };
  
  exports.googleCallback = (req, res) => {
    res.json({ message: 'Authentication successful', user: req.user });
  };

exports.registerUser = async(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {name, username, email, password} = req.body

  try{
    await connectionPool.getConnection();

    
    const existingUser = await connectionPool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUser[0].length > 0){
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connectionPool.query('INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)', [name, username, email, hashedPassword]);

    res.status(201).json({ message: 'User created successfully', user: { username, email } });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

