const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getStoreStatus } = require('../config/db');
const { findMockUserById } = require('../controllers/authController');

const getJwtSecret = () => process.env.JWT_SECRET || 'super_secret_jwt_key_smart_placement_2026_dev';

const resolveUserFromToken = async (token) => {
  if (!token) throw new Error('Authentication token is required');
  const decoded = jwt.verify(token, getJwtSecret());
  const { isMockStoreActive } = getStoreStatus();

  if (isMockStoreActive) {
    const mockUser = findMockUserById(decoded.id);
    if (!mockUser) throw new Error('User not found in session store');
    return mockUser;
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
};

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no bearer token provided' });
  }

  try {
    const token = authorization.split(' ')[1];
    req.user = await resolveUserFromToken(token);
    return next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Forbidden: Access restricted to roles: [${roles.join(', ')}]. Current role: ${req.user ? req.user.role : 'unauthenticated'}`,
    });
  }
  return next();
};

module.exports = { protect, authorize, resolveUserFromToken };
