const express = require('express');
const router = express.Router();
const {
  getAdminIntelligence,
  getStudentsRoster,
  getStudentDeepDive,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin intelligence routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/intelligence', getAdminIntelligence);
router.get('/students', getStudentsRoster);
router.get('/students/:id', getStudentDeepDive);

module.exports = router;
