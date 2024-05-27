// controllers/authController.js
exports.login = (req, res) => {
    res.send('Login with Google at /auth/google');
  };
  
  exports.logout = (req, res) => {
    req.logout();
    res.json({ message: 'Logged out' });
  };
  
  exports.googleCallback = (req, res) => {
    res.json({ message: 'Authentication successful', user: req.user });
  };
  