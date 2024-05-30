// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const session = require('express-session');
const express = require('express');
const connectionPool = require('../config/dbConfig')

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const userData = {
    googleId: profile.id,
    name: profile.displayName,
  };

  try {
    const user = await User.create(userData);
    // const user = await User.create(userData);
    return done(null, user);
  } catch (error) {
    console.error("Error creating user:", error);  // Log the error for debugging
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);  // Optional log for debugging
  done(null, user.userId); // Replace with "user.id" if that's your property name
});

passport.deserializeUser(async (userId, done) => {
  try {
    const [rows] = await connectionPool.execute('SELECT * FROM users WHERE userId = ?', [userId]);
    console.log("Deserialized user:", rows[0]);  // Optional log for debugging
    done(null, rows[0]);
  } catch (error) {
    console.error("Error deserializing user:", error);  // Log the error for debugging
    done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

module.exports = passport;