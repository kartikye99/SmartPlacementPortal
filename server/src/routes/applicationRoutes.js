const express = require('express');
const router = express.Router();
const {
  applyJob,
  getStudentApplications,
  getAllApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/apply', protect, authorize('student'), applyJob);
router.get('/my', protect, authorize('student'), getStudentApplications);
router.get('/', protect, authorize('admin'), getAllApplications);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
