const Resume = require('../models/Resume');
const Job = require('../models/Job');
const { getStoreStatus } = require('../config/db');
const { findMockJobById } = require('./jobController');
const { analyzeResumeAgainstJD, convertResumeToText } = require('../services/resumeService');

// In-Memory store for offline resilience
const mockResumes = {};

const getDefaultResumeData = (user) => ({
  personal: {
    fullName: user?.name || 'Alex Chen',
    email: user?.email || 'alex.chen@university.edu',
    phone: user?.phone || '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: user?.linkedin || 'https://linkedin.com/in/alex-chen-dev',
    github: user?.github || 'https://github.com/alex-chen',
    portfolio: 'https://alexchen.dev',
  },
  education: [
    {
      institution: 'National Institute of Technology, Karnataka',
      degree: 'B.Tech in Computer Science & Engineering',
      branch: user?.department || 'Computer Science & Engineering',
      cgpa: `${user?.cgpa || 8.8} / 10.0`,
      startYear: '2022',
      endYear: `${user?.graduationYear || 2026}`,
    },
    {
      institution: 'Delhi Public School, R.K. Puram',
      degree: 'Class XII (CBSE Senior Secondary)',
      branch: 'Science (Physics, Chemistry, Mathematics, CS)',
      cgpa: '96.2%',
      startYear: '2020',
      endYear: '2022',
    },
  ],
  skills: {
    languages: ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
    frameworks: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Redux Toolkit'],
    databases: ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'],
    coreCS: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design'],
    tools: ['Git', 'GitHub Actions', 'Docker', 'Postman', 'Linux / Bash', 'AWS (S3, EC2)'],
  },
  projects: [
    {
      title: 'Distributed Task Queue & Job Scheduler',
      techStack: ['Node.js', 'Redis', 'MongoDB', 'Docker'],
      duration: 'Jan 2026 - Mar 2026',
      liveUrl: 'https://scheduler-demo.dev',
      repoUrl: 'https://github.com/alex-chen/task-scheduler',
      bullets: [
        'Architected a distributed background job processing pipeline handling 10,000+ tasks/min with Redis streams.',
        'Implemented exponential backoff retry policies, dead-letter queues, and deterministic deduplication mechanisms.',
        'Reduced average queue latency by 42% through optimized connection pooling and Redis cluster sharding.',
      ],
    },
    {
      title: 'High-Concurrency E-Commerce Microservices Engine',
      techStack: ['React', 'Express', 'PostgreSQL', 'Kafka'],
      duration: 'Aug 2025 - Nov 2025',
      liveUrl: '',
      repoUrl: 'https://github.com/alex-chen/ecom-engine',
      bullets: [
        'Constructed 4 independent microservices communicating via Kafka event pub/sub with ACID transaction isolation.',
        'Designed normalized relational schemas and B+ tree indexing in PostgreSQL, sustaining 1,500 req/sec at peak load.',
        'Secured customer transactions with JWT authentication, role-based access control (RBAC), and rate limiting.',
      ],
    },
  ],
  experience: [
    {
      company: 'Razorpay Technologies',
      role: 'Software Engineering Intern',
      location: 'Bengaluru, India',
      duration: 'May 2025 - Jul 2025',
      bullets: [
        'Engineered automated settlement reconciliation pipelines, trimming daily audit latency from 45 mins to 6 mins.',
        'Refactored legacy REST microservices into Go, improving CPU utilization by 28% across production pods.',
        'Wrote unit and integration test suites with 92% code coverage using Jest and Supertest, eliminating regressions.',
      ],
    },
  ],
  achievements: [
    'Candidate Master (Rating 1920) on Codeforces; Knight (Rating 2085) on LeetCode with 600+ solved algorithmic problems.',
    'Secured Global Rank 142 in Google Code Jam 2025 Round 2 out of 35,000+ international participants.',
    'Won 1st Prize at Smart India Hackathon (SIH 2024) for developing an automated real-time disaster management telemetry dashboard.',
  ],
  certifications: [
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      year: '2025',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
  ],
  positions: [
    {
      role: 'Lead Technical Coordinator',
      organization: 'Google Developer Student Club (GDSC)',
      duration: '2024 - 2025',
      description: 'Led a team of 18 student developers; organized 12 hands-on workshops on DSA and System Design reaching 800+ attendees.',
    },
  ],
  codingProfiles: {
    leetcode: 'https://leetcode.com/u/alex_chen_dev/',
    codeforces: 'https://codeforces.com/profile/alex_chen',
    gfg: 'https://auth.geeksforgeeks.org/user/alex_chen',
    github: 'https://github.com/alex-chen',
  },
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
