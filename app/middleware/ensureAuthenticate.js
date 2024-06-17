const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check if the user is authenticated via session
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Check if there is a token in the request header
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (error) {
        return res.status(401).json({ error: true, message: 'Invalid token' });
      }
    }
  } else {
    return res.status(401).json({ error: true, message: 'Authorization header not found' });
  }

  // Check if there is a token in the `token-auth` header
  const token = req.header('token-auth');
  if (token) {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      return next();
    } catch (err) {
      return res.status(400).json({ error: true, message: 'Invalid Token' });
    }
  }

  return res.status(401).json({ error: true, message: 'This is a protected route' });
};
