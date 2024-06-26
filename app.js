// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./app/config/passport');
const indexRoutes = require('./app/routes/index');
const authRoutes = require('./app/routes/authRoutes');
const predictRoutes = require('./app/routes/predictRoutes');
const mysql = require('mysql2');
const loadModel = require('./loadModel');
require('dotenv').config();
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();

// Middleware to parse x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Middleware to parse JSON
app.use(express.json());

// Middleware for handling multipart/form-data
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Session setup
app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/', indexRoutes);
app.use('/', authRoutes);

loadModel().then(model => {
  app.locals.model = model;
  app.use('/', predictRoutes);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
