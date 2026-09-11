const Interview = require('../models/Interview');
const { getStoreStatus } = require('../config/db');
const {
  generateInitialQuestion,
  generateNextResponse,
  generateFinalEvaluation,
} = require('../services/interviewAiService');

// In-Memory store for offline resilience & quick mock mode
const mockInterviews = {};

/**
 * Helper to generate simple ID for mock interviews
 */
const generateMockId = () => 'intv_' + Math.random().toString(36).substr(2, 9);

const isOwnedBy = (interview, userId) => (
  interview && userId && interview.user?.toString() === userId.toString()
);

const getOwnedInterview = async (id, userId) => {
  const { isMockStoreActive } = getStoreStatus();
  if (isMockStoreActive) {
    const interview = mockInterviews[id];
    return isOwnedBy(interview, userId) ? interview : null;
  }
  return Interview.findOne({ _id: id, user: userId });
};

const appendLiveTranscript = async (id, userId, turns) => {
  const { isMockStoreActive } = getStoreStatus();
  const interview = await getOwnedInterview(id, userId);
  if (!interview) throw new Error('Interview session not found');
  if (interview.status !== 'in_progress') throw new Error('Interview session has concluded');

  interview.transcript.push(...turns);
  if (isMockStoreActive) {
    interview.updatedAt = new Date();
    mockInterviews[id] = interview;
  } else {
    await interview.save();
  }
  return interview;
};

/**
 * @desc    Start a new mock/live interview session
 * @route   POST /api/interviews/start
 * @access  Private
 */
const startInterview = async (req, res) => {
  try {
    const {
      jobId = 'general',
      company = 'General Technical Mock',
      jobTitle = 'Software Development Engineer',
      category = 'Technical',
      mode = 'voice',
      recordingConsentGiven = true,
    } = req.body;

    const userId = req.user?._id || 'student-001';
    const { isMockStoreActive } = getStoreStatus();

    // 1. Generate initial question based on category and company
    const initialQuestion = generateInitialQuestion(category, company, jobTitle);

    const initialTranscript = [
      {
        role: 'ai',
        message: initialQuestion,
        timestamp: new Date(),
      },
    ];

    if (isMockStoreActive) {
      const mockId = generateMockId();
      const mockSession = {
        _id: mockId,
        user: userId,
        jobId,
        company,
        jobTitle,
        category,
        mode,
        status: 'in_progress',
        durationSeconds: 0,
        recordingConsentGiven,
        transcript: initialTranscript,
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockInterviews[mockId] = mockSession;

      return res.status(201).json({
        success: true,
        interview: mockSession,
      });
    }

    // MongoDB path
    const interview = await Interview.create({
      user: userId,
      jobId,
      company,
      jobTitle,
      category,
      mode,
      status: 'in_progress',
      durationSeconds: 0,
      recordingConsentGiven,
      transcript: initialTranscript,
    });

    return res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return res.status(500).json({ message: error.message || 'Failed to start interview' });
  }
};

/**
 * @desc    Submit candidate answer & receive AI interviewer follow-up
 * @route   POST /api/interviews/:id/message
 * @access  Private
 */
const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Answer message is required' });
    }

    const { isMockStoreActive } = getStoreStatus();
    const interview = await getOwnedInterview(id, req.user?._id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    if (interview.status === 'completed') {
      return res.status(400).json({ message: 'This interview has already concluded' });
    }

    // Append user message
    const userMsg = {
      role: 'user',
      message: message.trim(),
      timestamp: new Date(),
    };
    interview.transcript.push(userMsg);

    // Generate dynamic/adaptive AI response or follow-up probe
    const aiResponseText = await generateNextResponse(
      interview.transcript,
      interview.category,
      interview.company,
      interview.jobTitle
    );

    // Append AI response
    const aiMsg = {
      role: 'ai',
      message: aiResponseText,
      timestamp: new Date(),
    };
    interview.transcript.push(aiMsg);

    if (isMockStoreActive) {
      interview.updatedAt = new Date();
      mockInterviews[id] = interview;
    } else {
      await interview.save();
    }

    return res.json({
      success: true,
      aiMessage: aiResponseText,
      transcript: interview.transcript,
    });
  } catch (error) {
    console.error('Error in interview conversation:', error);
    return res.status(500).json({ message: error.message || 'Failed to process interview step' });
  }
};

/**
 * @desc    Conclude interview and generate AI evaluation report
 * @route   POST /api/interviews/:id/end
 * @access  Private
 */
const endInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { durationSeconds = 0 } = req.body;

    const { isMockStoreActive } = getStoreStatus();
    const interview = await getOwnedInterview(id, req.user?._id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    interview.status = 'completed';
    interview.durationSeconds = durationSeconds;

    // Generate comprehensive evaluation
    const evaluation = await generateFinalEvaluation(
      interview.transcript,
      interview.category,
      interview.company,
      interview.jobTitle
    );

    interview.feedback = evaluation;

    if (isMockStoreActive) {
      interview.updatedAt = new Date();
      mockInterviews[id] = interview;
    } else {
      await interview.save();
    }

    return res.json({
      success: true,
      interview,
      feedback: evaluation,
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    return res.status(500).json({ message: error.message || 'Failed to conclude interview' });
  }
};

/**
 * @desc    Get user's mock interview history
 * @route   GET /api/interviews
 * @access  Private
 */
const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const list = Object.values(mockInterviews)
        .filter((inv) => !userId || inv.user?.toString() === userId.toString())
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json({ success: true, count: list.length, interviews: list });
    }

    const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get interview session details by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await getOwnedInterview(id, req.user?._id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    return res.json({ success: true, interview });
  } catch (error) {
    console.error('Error getting interview details:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get chronological improvement trajectory, 8-dimension averages, and active weakness radar
 * @route   GET /api/interviews/analytics/improvement
 * @access  Private
 */
const getImprovementTracker = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { isMockStoreActive } = getStoreStatus();

    let allInterviews = [];
    if (isMockStoreActive) {
      allInterviews = Object.values(mockInterviews)
        .filter((inv) => !userId || inv.user?.toString() === userId.toString())
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      allInterviews = await Interview.find({ user: userId, status: 'completed' })
        .sort({ createdAt: 1 });
    }

    const completed = allInterviews.filter((i) => i.status === 'completed' && i.feedback);

    if (completed.length === 0) {
      return res.json({
        success: true,
        count: 0,
        trajectory: [],
        dimensionAverages: {
          overall: 0,
          technical: 0,
          problemSolving: 0,
          communication: 0,
          confidence: 0,
          clarity: 0,
          structure: 0,
          conciseness: 0,
        },
        weaknessRadar: {
          critical: [],
          needsImprovement: [],
          strong: [],
        },
        activeRemediations: [],
      });
    }

    // Build chronological trajectory
    const trajectory = completed.map((item, idx) => {
      const prevScore = idx > 0 ? (completed[idx - 1].feedback?.overallScore || 0) : null;
      const currentScore = item.feedback?.overallScore || 75;
      const delta = prevScore !== null ? currentScore - prevScore : null;

      return {
        id: item._id,
        index: idx + 1,
        label: `Interview ${idx + 1}`,
        date: item.createdAt,
        company: item.company,
        jobTitle: item.jobTitle,
        category: item.category,
        mode: item.mode,
        score: currentScore,
        delta,
        technical: item.feedback?.technicalScore || currentScore,
        problemSolving: item.feedback?.problemSolvingScore || currentScore,
        communication: item.feedback?.communicationScore || currentScore,
        confidence: item.feedback?.confidenceScore || currentScore,
        clarity: item.feedback?.clarityScore || currentScore,
        structure: item.feedback?.structureScore || currentScore,
        conciseness: item.feedback?.concisenessScore || currentScore,
      };
    });

    // Compute aggregated averages across 8 dimensions
    const count = completed.length;
    const avg = (key) => Math.round(completed.reduce((acc, curr) => acc + (curr.feedback?.[key] || 0), 0) / count);

    const dimensionAverages = {
      overall: avg('overallScore'),
      technical: avg('technicalScore'),
      problemSolving: avg('problemSolvingScore') || avg('technicalScore'),
      communication: avg('communicationScore'),
      confidence: avg('confidenceScore'),
      clarity: avg('clarityScore') || avg('communicationScore'),
      structure: avg('structureScore') || avg('communicationScore'),
      conciseness: avg('concisenessScore') || avg('communicationScore'),
    };

    // Extract latest weakness radar
    const latest = completed[completed.length - 1];
    const weaknessRadar = latest.feedback?.weaknessAnalysis || {
      critical: [{ topic: 'Dynamic Programming', reason: 'Subproblem state transitions need practice' }],
      needsImprovement: [{ topic: 'DBMS', reason: 'ACID guarantees and isolation levels' }],
      strong: [{ topic: 'Distributed Caching', reason: 'Clear understanding of Redis & LRU' }],
    };

    const activeRemediations = latest.feedback?.recommendedPlan || [];

    return res.json({
      success: true,
      count,
      trajectory,
      dimensionAverages,
      weaknessRadar,
      activeRemediations,
      latestInterviewId: latest._id,
    });
  } catch (error) {
    console.error('Error fetching improvement tracker:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  endInterview,
  getInterviewHistory,
  getInterviewById,
  getImprovementTracker,
  getOwnedInterview,
  appendLiveTranscript,
};
