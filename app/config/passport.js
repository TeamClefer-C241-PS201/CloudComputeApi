// config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const session = require('express-session');
const express = require('express');
const connectionPool = require('../config/dbConfig');
const axios = require('axios');


const app = express();

app.use(session({
  maxAge: 24 * 60 * 60 * 1000,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URI,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const userData = {
      googleId: profile.id,
      name: profile.displayName,
      email: data.email,
    };

    try {
      console.log(userData);
      const user = await User.findOne(userData);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      return done(null, user);
    } catch (error) {
      console.error("Error creating user:", error);  // Log the error for debugging
      return done(error);
    }
  } catch (error) {
    console.error("Error fetching user data from Google:", error); // Log error
    done(error);
  }
}));

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);  // Optional log for debugging
  done(null, user.userId); 
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

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

module.exports = passport;