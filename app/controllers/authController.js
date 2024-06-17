// controllers/authController.js
const { body, validationResult } = require('express-validator');
const connectionPool = require("../config/dbConfig");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("../models/user");
const User = require("../models/user");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }).single('userPhoto');


exports.logout = (req, res) => {
  res.json({ error:false,message: "Logged out" });
};

exports.googleCallback = (req, res) => {
  // res.json({ message: 'Authentication successful', user: req.user });
  res.redirect("/");
};

exports.registerUser = async (req, res) => {
  const validationRules = [
    body('name')
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 5 }).withMessage('Name must be at least 5 characters long'),
    body('username')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .isLength({ min: 5 }).withMessage('Email must be at least 5 characters long'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ];

  await Promise.all(validationRules.map(validation => validation.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, errors: errors.array() });
  }

  let userPhotoUrl = 'https://storage.googleapis.com/cleferdev/templatePhoto/user.jpg'; 

  if (req.file) {
    userPhotoUrl = await User.uploadPhoto(req.file);
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
        .json({ error: true, message: "Username or email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connectionPool.query(
      "INSERT INTO users (name, username, email, password, userPhoto) VALUES (?, ?, ?, ?, ?)",
      [name, username, email, hashedPassword, userPhotoUrl]
    );

    res
      .status(201)
      .json({
        error: false,
        message: "User created successfully",
        user: { username, email, userPhotoUrl},
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "email is not registered yet" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({error:true, message: "Invalid password" });
    }
    const [userdata] = await connectionPool.query(
      "SELECT userId, username, name, userPhoto FROM users WHERE email = ?",
      [email]
    );
    console.log(userdata[0]);
    const { username, name, userPhoto, userId} = userdata[0];
    // Create and sign JWT token
    const token = jwt.sign({userId: user.userId, name: user.name, username: user.username, email: user.email }, process.env.JWT_SECRET);

    res.json({error:false,
      message: "Welcome!", 
      user: {userId,name,username,email,userPhoto,token}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error:true, message: "Server Error" });
  }
};

exports.edit = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: true, message: 'Error uploading file' });
    }

    const { name, username, email } = req.body;
    const userId = req.user.userId; // Get userId from authenticated user

    try {
      let userPhotoUrl = null;

      if (req.file) {
        userPhotoUrl = await User.uploadPhoto(userId, req.file);
      }

      // Prepare updatedFields object with non-empty values
      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (username) updatedFields.username = username;
      if (email) updatedFields.email = email;
      if (userPhotoUrl) updatedFields.userPhoto = userPhotoUrl;

      // Call User.edit method with userId and updatedFields
      const result = await User.edit(userId, updatedFields);

      if (result.affectedRows > 0) {
        res.status(200).json({
          error: false,
          message: 'User updated successfully',
          user: { userId, name, username, email, userPhoto: userPhotoUrl }
        });
      } else {
        res.status(404).json({ error: true, message: 'User not found' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: true, message: 'Server error' });
    }
  });
};

exports.getUser = async (req,res) => {
  try{
    userId = req.user.userId;
    console.log(userId);
    const userData = await User.getData(userId);
    res.status(200).json(userData);
  }catch (error){
    console.error(error.message);
    res.status(500).json({error:true, message:'Something Went Wrong'});
  }
};

exports.googleSignInAndroid = async (req, res) => {
  const idToken = req.body.idToken;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID_ANDROID
    });
    const payload = ticket.getPayload();
    const userData = {
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
    };

    const user = await User.findOne(userData);
    const token = jwt.sign({ userId: user.userId, name: user.name, username: user.username, email: user.email }, process.env.JWT_SECRET);

    res.json({error:false,
      message: 'Successfully authenticated',
      user: { name: user.name, username: user.username, email: user.email, token }
    });
  } catch (error) {
    res.status(400).json({ error:true, message:"invalid token" });
  }
};