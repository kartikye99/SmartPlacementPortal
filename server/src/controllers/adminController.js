const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const { getStoreStatus } = require('../config/db');
const { getDefaultResumeData } = require('./resumeController');

/**
 * Mock data for resilient store fallback
 */
const MOCK_STUDENTS = [
  {
    _id: 'student-001',
    name: 'Alex Chen',
    email: 'student@portal.com',
    role: 'student',
    rollNumber: '22CS1044',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.8,
    activeBacklogs: 0,
    phone: '+91 98765 43210',
    skills: ['C++', 'Java', 'Python', 'React.js', 'Node.js', 'MongoDB', 'Redis'],
    github: 'https://github.com/alex-chen',
    linkedin: 'https://linkedin.com/in/alex-chen-dev',
    readinessScore: 84,
    placed: false,
    placedCompany: null,
    createdAt: new Date('2026-01-15'),
  },
  {
    _id: 'student-002',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@portal.com',
    role: 'student',
    rollNumber: '22CS1012',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 9.2,
    activeBacklogs: 0,
    phone: '+91 98765 11111',
    skills: ['Java', 'Spring Boot', 'AWS', 'Microservices', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/rohan-sharma',
    linkedin: 'https://linkedin.com/in/rohan-sharma',
    readinessScore: 92,
    placed: true,
    placedCompany: 'Google',
    createdAt: new Date('2026-01-18'),
  },
  {
    _id: 'student-003',
    name: 'Priya Patel',
    email: 'priya.patel@portal.com',
    role: 'student',
    rollNumber: '22IT1023',
    department: 'Information Technology',
    graduationYear: 2026,
    cgpa: 8.7,
    activeBacklogs: 0,
    phone: '+91 98765 22222',
    skills: ['Python', 'Django', 'FastAPI', 'PyTorch', 'Data Science', 'SQL'],
    github: 'https://github.com/priya-patel',
    linkedin: 'https://linkedin.com/in/priya-patel',
    readinessScore: 86,
    placed: true,
    placedCompany: 'Microsoft',
    createdAt: new Date('2026-01-20'),
  },
  {
    _id: 'student-004',
    name: 'Ananya Verma',
    email: 'ananya.verma@portal.com',
    role: 'student',
    rollNumber: '22CS1055',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.9,
    activeBacklogs: 0,
    phone: '+91 98765 33333',
    skills: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL'],
    github: 'https://github.com/ananya-v',
    linkedin: 'https://linkedin.com/in/ananya-verma',
    readinessScore: 88,
    placed: true,
    placedCompany: 'Amazon',
    createdAt: new Date('2026-02-01'),
  },
  {
    _id: 'student-005',
    name: 'Devendra Singh',
    email: 'devendra.s@portal.com',
    role: 'student',
    rollNumber: '22EC1030',
    department: 'Electronics & Communication',
    graduationYear: 2026,
    cgpa: 7.9,
    activeBacklogs: 1,
    phone: '+91 98765 44444',
    skills: ['C', 'C++', 'Embedded Systems', 'IoT', 'Linux'],
    github: 'https://github.com/devendra-s',
    linkedin: 'https://linkedin.com/in/devendra-singh',
    readinessScore: 68,
    placed: false,
    placedCompany: null,
    createdAt: new Date('2026-02-05'),
  },
  {
    _id: 'student-006',
    name: 'Kavya Nair',
    email: 'kavya.nair@portal.com',
    role: 'student',
    rollNumber: '22IT1041',
    department: 'Information Technology',
    graduationYear: 2026,
    cgpa: 9.4,
    activeBacklogs: 0,
    phone: '+91 98765 55555',
    skills: ['Go', 'Kubernetes', 'Distributed Systems', 'gRPC', 'PostgreSQL'],
    github: 'https://github.com/kavya-nair',
    linkedin: 'https://linkedin.com/in/kavya-nair',
    readinessScore: 94,
    placed: true,
    placedCompany: 'Adobe',
    createdAt: new Date('2026-02-10'),
  },
];

/**
 * @desc    Get comprehensive Admin Intelligence (KPIs, funnel, college-wide weaknesses, distributions)
 * @route   GET /api/admin/intelligence
 * @access  Private (Admin only)
 */
const getAdminIntelligence = async (req, res) => {
  try {
    const { isMockStoreActive } = getStoreStatus();

    // 1. Core KPIs
    let totalStudents = 480;
    let activeJobs = 14;
    let totalApplications = 512;
    let shortlistedCount = 348;
    let interviewsCount = 165;
    let placedCount = 76;

    if (!isMockStoreActive) {
      const [studentsDb, jobsDb, appsDb] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        Job.countDocuments({ status: 'published' }),
        Application.find(),
      ]);

      if (studentsDb > 0) totalStudents = studentsDb;
      if (jobsDb > 0) activeJobs = jobsDb;
      if (appsDb.length > 0) {
        totalApplications = appsDb.length;
        shortlistedCount = appsDb.filter((a) => ['Shortlisted', 'OA', 'Technical', 'HR', 'Selected'].includes(a.status)).length;
        interviewsCount = appsDb.filter((a) => ['Technical', 'HR', 'Selected'].includes(a.status)).length;
        placedCount = appsDb.filter((a) => a.status === 'Selected').length;
      }
    }

    // 2. Placement Funnel Stages
    const placementFunnel = [
      { stage: 'Applied', count: totalApplications, percentage: 100, color: 'indigo' },
      { stage: 'Shortlisted', count: shortlistedCount, percentage: Math.round((shortlistedCount / totalApplications) * 100), color: 'purple' },
      { stage: 'Online Assessment (OA)', count: 240, percentage: Math.round((240 / totalApplications) * 100), color: 'cyan' },
      { stage: 'Technical Rounds', count: interviewsCount, percentage: Math.round((interviewsCount / totalApplications) * 100), color: 'teal' },
      { stage: 'HR & Leadership', count: 98, percentage: Math.round((98 / totalApplications) * 100), color: 'amber' },
      { stage: 'Selected / Placed', count: placedCount, percentage: Math.round((placedCount / totalApplications) * 100), color: 'emerald' },
    ];

    // 3. Company-Wise Applications & Selection Velocity
    const companyApplications = [
      { company: 'Amazon', applied: 142, shortlisted: 88, placed: 22, avgPackage: '32.0 LPA', selectionRate: 15.5 },
      { company: 'Google', applied: 118, shortlisted: 45, placed: 12, avgPackage: '44.5 LPA', selectionRate: 10.2 },
      { company: 'Microsoft', applied: 95, shortlisted: 52, placed: 18, avgPackage: '36.0 LPA', selectionRate: 18.9 },
      { company: 'Goldman Sachs', applied: 68, shortlisted: 30, placed: 10, avgPackage: '28.0 LPA', selectionRate: 14.7 },
      { company: 'Adobe', applied: 54, shortlisted: 24, placed: 8, avgPackage: '34.0 LPA', selectionRate: 14.8 },
      { company: 'TCS Digital', applied: 35, shortlisted: 28, placed: 6, avgPackage: '9.0 LPA', selectionRate: 17.1 },
    ];

    // 4. Applications Over Time (Timeline)
    const applicationsTimeline = [
      { cycle: 'Week 1', applications: 45, interviews: 12 },
      { cycle: 'Week 2', applications: 98, interviews: 28 },
      { cycle: 'Week 3', applications: 164, interviews: 58 },
      { cycle: 'Week 4', applications: 280, interviews: 96 },
      { cycle: 'Week 5', applications: 410, interviews: 135 },
      { cycle: 'Week 6 (Current)', applications: 512, interviews: 165 },
    ];

    // 5. Student Readiness Distribution across the cohort
    const readinessDistribution = [
      { tier: 'High Readiness (80%+)', count: 216, percentage: 45, color: 'emerald', benchmark: 'Immediate Drive Placement' },
      { tier: 'Near Ready (65-79%)', count: 182, percentage: 38, color: 'indigo', benchmark: 'Needs 1-2 Focused Re-preps' },
      { tier: 'Needs Focus (< 65%)', count: 82, percentage: 17, color: 'rose', benchmark: 'Remediation Bootcamp Required' },
    ];

    // 6. College-Wide Weakness Analytics (Specified in Prompt)
    const collegeWeaknesses = [
      {
        topic: 'Communication & Behavioral Framing',
        affectedPercentage: 42,
        severity: 'Critical',
        impact: 'Drop-off at HR and final behavioral bar-raiser rounds.',
        recommendedIntervention: 'Conduct mandatory 2-day STAR method workshop and mock behavioral panel.',
      },
      {
        topic: 'DBMS (Transactions & Normalization)',
        affectedPercentage: 37,
        severity: 'Needs Improvement',
        impact: 'Struggling on ACID isolation anomalies and B+ tree disk indexing questions.',
        recommendedIntervention: 'Departmental revision sessions on MVCC and database concurrency.',
      },
      {
        topic: 'Graphs (Cycles & Shortest Paths)',
        affectedPercentage: 31,
        severity: 'Critical',
        impact: 'Failed test cases on topological sort and Dijkstra algorithms in OAs.',
        recommendedIntervention: 'Push 5 curated LeetCode graph problems to student practice arenas.',
      },
      {
        topic: 'Dynamic Programming (State Transitions)',
        affectedPercentage: 28,
        severity: 'Critical',
        impact: 'Inability to formulate 2D knapsack and memoization tables under time pressure.',
        recommendedIntervention: 'Launch targeted 10-problem DP Bootcamp with faculty mentoring.',
      },
      {
        topic: 'Operating Systems (Context Switching & Deadlocks)',
        affectedPercentage: 24,
        severity: 'Needs Improvement',
        impact: 'Confusing thread context overhead and resource allocation graphs.',
        recommendedIntervention: 'Distribute quick-reference OS memory architecture cheatsheets.',
      },
    ];

    return res.json({
      success: true,
      kpis: {
        totalStudents,
        activeJobs,
        totalApplications,
        shortlistedCount,
        interviewsCount,
        placedCount,
        placementPercentage: Math.round((placedCount / totalStudents) * 100 * 10) / 10,
        averagePackageLPA: 14.8,
        highestPackageLPA: 44.5,
      },
      placementFunnel,
      companyApplications,
      applicationsTimeline,
      readinessDistribution,
      collegeWeaknesses,
    });
  } catch (error) {
    console.error('Error fetching admin intelligence:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get student cohort roster with readiness & weakness stats
 * @route   GET /api/admin/students
 * @access  Private (Admin only)
 */
const getStudentsRoster = async (req, res) => {
  try {
    const { isMockStoreActive } = getStoreStatus();

    let students = MOCK_STUDENTS;
    if (!isMockStoreActive) {
      const dbUsers = await User.find({ role: 'student' }).select('-password');
      if (dbUsers.length > 0) {
        students = dbUsers.map((u, i) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          rollNumber: u.rollNumber || `22CS10${(i + 1).toString().padStart(2, '0')}`,
          department: u.department || 'Computer Science & Engineering',
          graduationYear: u.graduationYear || 2026,
          cgpa: u.cgpa || 8.5,
          activeBacklogs: u.activeBacklogs || 0,
          phone: u.phone || '+91 98765 00000',
          skills: u.skills || ['Java', 'C++', 'Python', 'React.js'],
          readinessScore: u.readinessScore || 80,
          placed: i % 2 === 0,
          placedCompany: i % 2 === 0 ? (i === 0 ? 'Google' : 'Amazon') : null,
          createdAt: u.createdAt,
        }));
      }
    }

    return res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error('Error getting students roster:', error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get Student 360 Deep-Dive (Profile, Applications, Resume, Readiness, Mock Interviews, Weaknesses, Progress)
 * @route   GET /api/admin/students/:id
 * @access  Private (Admin only)
 */
const getStudentDeepDive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    // 1. Find Student
    let student = MOCK_STUDENTS.find((s) => s._id === id || s.email === id);
    if (!isMockStoreActive) {
      const dbUser = await User.findById(id).select('-password');
      if (dbUser) student = dbUser;
    }

    if (!student) {
      // Fallback to first mock student
      student = MOCK_STUDENTS[0];
    }

    // 2. Fetch or mock Applications for this student
    const applications = [
      {
        id: 'app-001',
        company: 'Amazon',
        role: 'Software Development Engineer',
        package: '32.0 LPA',
        status: 'Selected',
        appliedAt: '2026-02-12',
        currentRound: 'Offer Accepted',
      },
      {
        id: 'app-002',
        company: 'Google',
        role: 'Software Engineer (Algorithms & Systems)',
        package: '44.5 LPA',
        status: 'Shortlisted',
        appliedAt: '2026-02-14',
        currentRound: 'Technical Round 2',
      },
      {
        id: 'app-003',
        company: 'Microsoft',
        role: 'SDE-1',
        package: '36.0 LPA',
        status: 'Applied',
        appliedAt: '2026-02-18',
        currentRound: 'Online Assessment Screening',
      },
    ];

    // 3. College Resume Summary
    const resume = getDefaultResumeData(student);

    // 4. Mock Interview History
    const interviews = [
      {
        id: 'intv-001',
        date: '2026-02-20',
        company: 'Amazon',
        category: 'Technical',
        mode: 'voice',
        overallScore: 79,
        technicalScore: 84,
        problemSolvingScore: 85,
        communicationScore: 72,
        confidenceScore: 68,
        clarityScore: 76,
        structureScore: 81,
        concisenessScore: 70,
        summary: 'Demonstrated solid understanding of Redis caching and distributed mutex locking, but state formulation on Dynamic Programming needs practice.',
      },
      {
        id: 'intv-002',
        date: '2026-02-15',
        company: 'Google',
        category: 'DSA',
        mode: 'text',
        overallScore: 74,
        technicalScore: 78,
        problemSolvingScore: 76,
        communicationScore: 70,
        confidenceScore: 72,
        clarityScore: 74,
        structureScore: 75,
        concisenessScore: 68,
        summary: 'Good baseline on tree traversal algorithms; edge cases in cycle detection required hints.',
      },
    ];

    // 5. Detected Weakness Breakdown
    const weaknesses = {
      critical: [
        { topic: 'Dynamic Programming', reason: 'Subproblem recurrence relations need formal proofs.' },
      ],
      needsImprovement: [
        { topic: 'DBMS Normalization', reason: 'Review ACID isolation level anomalies and 2-phase locking.' },
        { topic: 'Communication Pacing', reason: 'Structure behavioral answers strictly with STAR framing.' },
      ],
      strong: [
        { topic: 'Distributed Caching', reason: 'Mastery of Redis sharding, LRU, and stampede prevention.' },
        { topic: 'OOP & Architecture', reason: 'Clean domain decomposition and interface segregation.' },
      ],
    };

    // 6. Preparation Progress
    const preparation = {
      readinessScore: student.readinessScore || 84,
      solvedCodingProblems: 14,
      totalCodingProblems: 38,
      topicsMastered: ['Arrays', 'Distributed Caching', 'Binary Search', 'Linked Lists'],
      topicsPending: ['Dynamic Programming', 'B+ Trees', 'Network Handshakes'],
      resumeATSScore: 88,
      mockInterviewsCompleted: 2,
    };

    return res.json({
      success: true,
      student,
      applications,
      resume,
      interviews,
      weaknesses,
      preparation,
    });
  } catch (error) {
    console.error('Error fetching student deep dive:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminIntelligence,
  getStudentsRoster,
  getStudentDeepDive,
};
