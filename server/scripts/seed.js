const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_placement_portal');
    console.log('[Seed] Connected to MongoDB');

    await User.deleteMany();
    console.log('[Seed] Cleared existing users');

    const createdUsers = await User.create([
      {
        name: 'Alex Chen',
        email: 'student@portal.com',
        password: 'Password123!',
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
      },
      {
        name: 'Dr. Sarah Jenkins',
        email: 'admin@portal.com',
        password: 'Password123!',
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
      },
    ]);

    console.log(`[Seed] Seeded ${createdUsers.length} users successfully!`);
    console.log('Demo Student: student@portal.com / Password123!');
    console.log('Demo Admin: admin@portal.com / Password123!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
