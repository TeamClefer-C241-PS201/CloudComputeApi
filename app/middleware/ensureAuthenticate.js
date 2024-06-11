// middlewares/ensureAuthenticated.js
const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next();
//     }
//     res.status(401).json({ message: 'This is a protected route', user: req.user });;
//   };

module.exports = function(req,res,next) {
  const token = req.header('token-auth') || req.isAuthenticated();
  if(!token) return res.status(401).json({ message: 'This is a protected route', user: req.user });

  try{
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  }catch (err) {
    res.status(400).send('Invalid Token');
  }
};