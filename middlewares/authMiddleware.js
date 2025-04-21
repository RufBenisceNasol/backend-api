// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = user;  // Ensure user is correctly set in the request object
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (
      typeof requiredRole !== 'string' ||
      typeof req.user.role !== 'string' ||
      req.user.role.toLowerCase() !== requiredRole.toLowerCase()
    ) {
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }

    next();
  };
};

// ✅ Export both
module.exports = {
  authenticate,
  checkRole,
};
