const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  endInterview,
  getInterviewHistory,
  getInterviewById,
  getImprovementTracker,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/start', startInterview);
router.get('/', getInterviewHistory);
router.get('/analytics/improvement', getImprovementTracker);
router.get('/:id', getInterviewById);
router.post('/:id/message', submitAnswer);
router.post('/:id/end', endInterview);

module.exports = router;
