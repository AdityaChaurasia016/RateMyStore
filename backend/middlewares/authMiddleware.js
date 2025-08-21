const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header required' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const authorize = (roles = []) => (req, res, next) => {
  if (!roles.length || roles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden: Access denied' });
};

module.exports = { authenticate, authorize };