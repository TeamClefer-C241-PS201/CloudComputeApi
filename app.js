// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./app/config/passport'); 
const indexRoutes = require('./app/routes/index');
const authRoutes = require('./app/routes/authRoutes');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

app.use(express.json());

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

// Configure session middleware
app.use(session({
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
