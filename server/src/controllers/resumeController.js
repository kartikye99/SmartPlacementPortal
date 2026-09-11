const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { getStoreStatus } = require('../config/db');
const { findMockJobById } = require('./jobController');
const { analyzeResumeAgainstJD, convertResumeToText } = require('../services/resumeService');

// In-Memory store for offline resilience
const mockResumes = {};

const getDefaultResumeData = (user) => ({
  personal: {
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    portfolio: '',
  },
  education: user?.department
    ? [
        {
          institution: '',
          degree: 'B.Tech',
          branch: user?.department || '',
          cgpa: user?.cgpa ? `${user.cgpa} / 10.0` : '',
          startYear: '',
          endYear: `${user?.graduationYear || ''}`,
        },
      ]
    : [],
  skills: {
    languages: Array.isArray(user?.skills) ? user.skills : [],
    frameworks: [],
    databases: [],
    coreCS: [],
    tools: [],
  },
  projects: [],
  experience: [],
  achievements: [],
  certifications: [],
  positions: [],
  codingProfiles: {
    leetcode: '',
    codeforces: '',
    gfg: '',
    github: user?.github || '',
  },
});
});

/**
 * @desc    Get current student's saved resume
 * @route   GET /api/resumes/my
 * @access  Private
 */
const getMyResume = async (req, res) => {
  try {
    const userId = req.user._id ? req.user._id.toString() : 'student-001';
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      if (!mockResumes[userId]) {
        mockResumes[userId] = {
          _id: `resume-${userId}`,
          user: userId,
          ...getDefaultResumeData(req.user),
        };
      }
      return res.json({ success: true, resume: mockResumes[userId] });
    }

    let resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      resume = await Resume.create({
        user: req.user._id,
        ...getDefaultResumeData(req.user),
      });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Save/update current student's resume
 * @route   POST /api/resumes/my
 * @access  Private
 */
const saveMyResume = async (req, res) => {
  try {
    const userId = req.user._id ? req.user._id.toString() : 'student-001';
    const { isMockStoreActive } = getStoreStatus();
    const updatedData = req.body;

    if (isMockStoreActive) {
      mockResumes[userId] = {
        _id: `resume-${userId}`,
        user: userId,
        ...updatedData,
        updatedAt: new Date().toISOString(),
      };
      return res.json({
        success: true,
        message: 'Resume saved successfully in college placement format!',
        resume: mockResumes[userId],
      });
    }

    let resume = await Resume.findOne({ user: req.user._id });
    if (!resume) {
      resume = new Resume({ user: req.user._id, ...updatedData });
    } else {
      Object.assign(resume, updatedData);
    }
    await resume.save();

    return res.json({
      success: true,
      message: 'Resume saved successfully in college placement format!',
      resume,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Analyze resume against a job description (with resumeHash + jdHash cache)
 * @route   POST /api/resumes/analyze
 * @access  Private
 */
const analyzeResume = async (req, res) => {
  try {
    const { resume, resumeText, jobId, jdText } = req.body;
    const { isMockStoreActive } = getStoreStatus();

    let job = null;
    let targetJdText = jdText || '';

    if (jobId) {
      job = isMockStoreActive ? findMockJobById(jobId) : await Job.findById(jobId);
      if (job && !targetJdText) {
        targetJdText = job.description;
      }
    }

    if (!targetJdText && !job) {
      // Default standard fallback drive
      job = {
        title: 'Software Development Engineer (SDE-1)',
        company: { name: 'Amazon' },
        description: 'Amazon is hiring SDEs proficient in Data Structures, Algorithms, C++, OOP, Microservices, and Distributed Systems.',
      };
      targetJdText = job.description;
    }

    const inputResume = resume || resumeText || getDefaultResumeData(req.user);
    const analysis = await analyzeResumeAgainstJD(inputResume, targetJdText, job || {});

    return res.json({
      success: true,
      cached: analysis.cached,
      latencyMs: analysis.latencyMs,
      analysis,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get match analysis for a target drive using student's current resume
 * @route   GET /api/resumes/match/:jobId
 * @access  Private
 */
const getResumeJobMatch = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id ? req.user._id.toString() : 'student-001';
    const { isMockStoreActive } = getStoreStatus();

    // 1. Get job
    const job = isMockStoreActive ? findMockJobById(jobId) : await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    // 2. Get student resume
    let studentResume = null;
    if (isMockStoreActive) {
      studentResume = mockResumes[userId] || getDefaultResumeData(req.user);
    } else {
      studentResume = await Resume.findOne({ user: req.user._id });
      if (!studentResume) {
        studentResume = getDefaultResumeData(req.user);
      }
    }

    // 3. Analyze with strict caching
    const analysis = await analyzeResumeAgainstJD(studentResume, job.description, job);

    return res.json({
      success: true,
      cached: analysis.cached,
      latencyMs: analysis.latencyMs,
      job: {
        id: job._id,
        company: job.company?.name,
        title: job.title,
      },
      analysis,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyResume,
  saveMyResume,
  analyzeResume,
  getResumeJobMatch,
  getDefaultResumeData,
};
