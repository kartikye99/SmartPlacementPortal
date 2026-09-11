const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getStoreStatus } = require('../config/db');

// In-Memory store fallback to guarantee 100% turnkey functionality even if local MongoDB isn't running
const mockUsers = [
  {
    _id: 'mock-student-001',
    name: 'Alex Chen',
    email: 'student@portal.com',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    role: 'student',
    department: 'Computer Science & Engineering',
    rollNumber: 'CS2026-089',
    cgpa: 9.1,
    graduationYear: 2026,
    phone: '+91 98765 43210',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Python', 'Algorithms', 'Docker'],
    readinessScore: 92,
    placementStatus: 'In Process',
    bio: 'Senior Year CS undergrad passionate about high-concurrency backend systems and modern frontend architectures.',
    github: 'https://github.com/alex-chen',
    linkedin: 'https://linkedin.com/in/alex-chen-dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock-admin-001',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@portal.com',
    passwordHash: bcrypt.hashSync('Password123!', 10),
    role: 'admin',
    department: 'Training & Placement Cell',
    rollNumber: 'TPO-ADMIN-01',
    cgpa: 10.0,
    graduationYear: 2012,
    phone: '+91 98111 22334',
    skills: ['Corporate Relations', 'Placement Analytics', 'Student Mentoring', 'Industry Partnerships'],
    readinessScore: 100,
    placementStatus: 'Placed',
    bio: 'Head of Placement & Career Development, driving institutional industry connect and tier-1 recruitment drives.',
    github: 'https://github.com/tpo-cell',
    linkedin: 'https://linkedin.com/in/sarah-jenkins-tpo',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
  },
];

const findMockUserById = (id) => {
  return mockUsers.find((u) => u._id === id);
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super_secret_jwt_key_smart_placement_2026_dev', {
    expiresIn: '7d',
  });
};

const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.passwordHash;
  return userObj;
};

// @desc    Register a new user (Student or Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, department, rollNumber, cgpa } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const { isMockStoreActive } = getStoreStatus();

  if (isMockStoreActive) {
    const existing = mockUsers.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    const newUser = {
      _id: `mock-${Date.now()}`,
      name,
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 10),
      role: role === 'admin' ? 'admin' : 'student',
      department: department || 'Computer Science & Engineering',
      rollNumber: rollNumber || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
      cgpa: Number(cgpa) || 8.0,
      graduationYear: 2026,
      phone: '+91 98765 00000',
      skills: ['React', 'JavaScript', 'Problem Solving'],
      readinessScore: 78,
      placementStatus: 'In Process',
      bio: 'Ready to kickstart campus placement journey!',
      github: '',
      linkedin: '',
      avatar: '',
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return res.status(201).json({
      success: true,
      token: generateToken(newUser._id, newUser.role),
      user: sanitizeUser(newUser),
      message: 'Registration successful',
    });
  }

  // MongoDB Flow
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ message: 'A user with this email already exists.' });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role: role === 'admin' ? 'admin' : 'student',
    department: department || 'Computer Science & Engineering',
    rollNumber: rollNumber || `STD-${Math.floor(1000 + Math.random() * 9000)}`,
    cgpa: Number(cgpa) || 8.0,
  });

  if (user) {
    return res.status(201).json({
      success: true,
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
      message: 'Registration successful',
    });
  } else {
    return res.status(400).json({ message: 'Invalid user registration data.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const { isMockStoreActive } = getStoreStatus();

  if (isMockStoreActive) {
    const user = mockUsers.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    return res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
      message: 'Login successful',
    });
  }

  // MongoDB Flow
  const user = await User.findOne({ email: normalizedEmail });
  if (user && (await user.matchPassword(password))) {
    return res.json({
      success: true,
      token: generateToken(user._id, user.role),
      user: sanitizeUser(user),
      message: 'Login successful',
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { isMockStoreActive } = getStoreStatus();
  const fields = ['name', 'phone', 'department', 'cgpa', 'graduationYear', 'skills', 'bio', 'github', 'linkedin', 'avatar'];

  if (isMockStoreActive) {
    const user = mockUsers.find((u) => u._id === req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found in store' });
    }

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        user[f] = req.body[f];
      }
    });

    // Recalculate readiness score dynamically
    let score = 50;
    if (user.cgpa && user.cgpa >= 8.0) score += 15;
    if (user.skills && user.skills.length >= 4) score += 15;
    if (user.github && user.github.length > 5) score += 10;
    if (user.linkedin && user.linkedin.length > 5) score += 10;
    user.readinessScore = Math.min(100, score);

    return res.json({
      success: true,
      user: sanitizeUser(user),
      message: 'Profile updated successfully',
    });
  }

  // MongoDB Flow
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      user[f] = req.body[f];
    }
  });

  // Calculate score
  let score = 50;
  if (user.cgpa && user.cgpa >= 8.0) score += 15;
  if (user.skills && user.skills.length >= 4) score += 15;
  if (user.github && user.github.length > 5) score += 10;
  if (user.linkedin && user.linkedin.length > 5) score += 10;
  user.readinessScore = Math.min(100, score);

  const updatedUser = await user.save();
  return res.json({
    success: true,
    user: sanitizeUser(updatedUser),
    message: 'Profile updated successfully',
  });
};

// @desc    Get portal stats for Student / Admin dashboards
// @route   GET /api/auth/stats
// @access  Private
const getPortalStats = async (req, res) => {
  const role = req.user.role;

  if (role === 'admin') {
    return res.json({
      success: true,
      data: {
        totalStudents: 480,
        placedStudents: 394,
        placementRate: 82.1,
        activeDrives: 14,
        upcomingDrives: 6,
        avgPackageLPA: 12.8,
        highestPackageLPA: 44.5,
        topRecruiters: ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Oracle', 'Goldman Sachs'],
        recentApplicants: [
          { id: '1', name: 'Rohan Sharma', branch: 'CSE', cgpa: 9.2, company: 'Google', role: 'SWE Intern', status: 'Shortlisted' },
          { id: '2', name: 'Priya Patel', branch: 'ECE', cgpa: 8.7, company: 'Microsoft', role: 'Software Engineer', status: 'Interviewing' },
          { id: '3', name: 'Ananya Verma', branch: 'IT', cgpa: 8.9, company: 'Amazon', role: 'SDE-1', status: 'Offer Extended' },
          { id: '4', name: 'Kavya Nair', branch: 'CSE', cgpa: 9.4, company: 'Adobe', role: 'Product Intern', status: 'Applied' },
          { id: '5', name: 'Devendra Singh', branch: 'EEE', cgpa: 8.2, company: 'Oracle', role: 'Cloud Engineer', status: 'Shortlisted' },
        ],
        branchStats: [
          { branch: 'Computer Science', rate: 94, count: 180 },
          { branch: 'Information Technology', rate: 91, count: 120 },
          { branch: 'Electronics & Comm.', rate: 84, count: 100 },
          { branch: 'Electrical Eng.', rate: 72, count: 80 },
        ],
      },
    });
  }

  // Student stats
  return res.json({
    success: true,
    data: {
      appliedDrives: 7,
      shortlistedDrives: 4,
      pendingInterviews: 2,
      offersReceived: 1,
      targetCompany: 'Google India',
      upcomingSchedules: [
        { id: 's1', company: 'Google', round: 'Technical Round 2 (DSA & System Design)', date: 'Sept 14, 2026', time: '10:30 AM', mode: 'Virtual (Google Meet)' },
        { id: 's2', company: 'Microsoft', round: 'Managerial & Core Culture Fit', date: 'Sept 18, 2026', time: '02:00 PM', mode: 'Campus Auditorium B' },
      ],
      activeDrives: [
        { id: 'd1', company: 'Google', role: 'Associate Software Engineer', ctc: '32 LPA', location: 'Bengaluru / Hyderabad', deadline: 'Sept 12, 2026', eligibility: 'CGPA >= 8.0', status: 'Shortlisted', logo: 'G' },
        { id: 'd2', company: 'Microsoft', role: 'Software Development Engineer', ctc: '28 LPA', location: 'Hyderabad / Noida', deadline: 'Sept 16, 2026', eligibility: 'CGPA >= 7.5', status: 'Interviewing', logo: 'M' },
        { id: 'd3', company: 'Amazon', role: 'Applied Scientist / SDE', ctc: '34 LPA', location: 'Bengaluru', deadline: 'Sept 20, 2026', eligibility: 'CGPA >= 8.5', status: 'Applied', logo: 'A' },
        { id: 'd4', company: 'Goldman Sachs', role: 'Analyst - Engineering', ctc: '26 LPA', location: 'Bengaluru', deadline: 'Sept 25, 2026', eligibility: 'CGPA >= 8.0', status: 'Not Applied', logo: 'GS' },
      ],
    },
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getPortalStats,
  findMockUserById,
  mockUsers,
};
