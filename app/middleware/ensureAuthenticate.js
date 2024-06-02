// middlewares/ensureAuthenticated.js
module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'This is a protected route', user: req.user });;
  };
  