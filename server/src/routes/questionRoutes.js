const express = require('express');
const router = express.Router();
const {
  getQuestions,
  getRecommendedQuestionsForJob,
  toggleQuestionSolved,
  getStudentCodingStats,
  generateQuestions,
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// All question routes are protected
router.use(protect);

router.get('/', getQuestions);
router.get('/stats', getStudentCodingStats);
router.get('/recommended/:jobId', getRecommendedQuestionsForJob);
router.post('/generate', generateQuestions);
router.post('/:id/toggle-solve', toggleQuestionSolved);

module.exports = router;
