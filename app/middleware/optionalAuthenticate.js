const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const tokenHeader = req.headers['token-auth'];
    if (tokenHeader) {
      try {
        const decoded = jwt.verify(tokenHeader, process.env.JWT_SECRET);
        req.user = decoded;
      } catch (error) {
        return res.status(401).json({ error: true, message: 'Invalid token' });
      }
    }
    next();
  };
  
