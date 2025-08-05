const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
  let token;

  // Support both 'Authorization: Bearer <token>' and 'x-auth-token'
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.header('x-auth-token'); // fallback for Flutter and Web
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
