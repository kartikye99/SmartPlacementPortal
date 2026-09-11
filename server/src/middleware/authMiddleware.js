const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStoreStatus } = require('../config/db');
const { findMockUserById } = require('../controllers/authController');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_smart_placement_2026_dev');

      const { isMockStoreActive } = getStoreStatus();
      if (isMockStoreActive) {
        const mockUser = findMockUserById(decoded.id);
        if (!mockUser) {
          return res.status(401).json({ message: 'Not authorized, user not found in session store' });
        }
        req.user = mockUser;
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no bearer token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted to roles: [${roles.join(', ')}]. Current role: ${req.user ? req.user.role : 'unauthenticated'}`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
