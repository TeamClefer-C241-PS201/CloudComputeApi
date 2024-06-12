const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check if the user is authenticated via session
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Check if there is a token in the request header
  const token = req.header('token-auth');
  if (!token) {
    return res.status(401).json({ message: 'This is a protected route', user: req.user });
  }

  // Verify the JWT token
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};