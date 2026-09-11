const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  togglePublishJob,
  getJobPreparation,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);
router.get('/:id/prepare', protect, getJobPreparation);
router.post('/', protect, authorize('admin'), createJob);
router.put('/:id', protect, authorize('admin'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);
router.put('/:id/publish', protect, authorize('admin'), togglePublishJob);

module.exports = router;
