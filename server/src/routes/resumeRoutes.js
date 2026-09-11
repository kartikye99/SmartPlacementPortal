const express = require('express');
const router = express.Router();
const {
  getMyResume,
  saveMyResume,
  analyzeResume,
  getResumeJobMatch,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/my', getMyResume);
router.post('/my', saveMyResume);
router.post('/analyze', analyzeResume);
router.get('/match/:jobId', getResumeJobMatch);

module.exports = router;
