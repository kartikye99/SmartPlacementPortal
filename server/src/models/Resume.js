const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    personal: {
      fullName: { type: String, default: 'Alex Chen' },
      email: { type: String, default: 'alex.chen@university.edu' },
      phone: { type: String, default: '+91 98765 43210' },
      location: { type: String, default: 'Bengaluru, India' },
      linkedin: { type: String, default: 'https://linkedin.com/in/alex-chen-dev' },
      github: { type: String, default: 'https://github.com/alex-chen' },
      portfolio: { type: String, default: 'https://alexchen.dev' },
    },
    education: [
      {
        institution: { type: String, default: 'National Institute of Technology' },
        degree: { type: String, default: 'B.Tech in Computer Science & Engineering' },
        branch: { type: String, default: 'Computer Science & Engineering' },
        cgpa: { type: String, default: '8.8 / 10.0' },
        startYear: { type: String, default: '2022' },
        endYear: { type: String, default: '2026' },
      },
      {
        institution: { type: String, default: 'Delhi Public School' },
        degree: { type: String, default: 'Class XII (CBSE Senior Secondary)' },
        branch: { type: String, default: 'Science (PCM + CS)' },
        cgpa: { type: String, default: '96.2%' },
        startYear: { type: String, default: '2020' },
        endYear: { type: String, default: '2022' },
      },
    ],
    skills: {
      languages: {
        type: [String],
        default: ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
      },
      frameworks: {
        type: [String],
        default: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'Redux Toolkit'],
      },
      databases: {
        type: [String],
        default: ['MongoDB', 'PostgreSQL', 'Redis', 'MySQL'],
      },
      coreCS: {
        type: [String],
        default: ['Data Structures & Algorithms', 'Operating Systems', 'DBMS', 'Computer Networks', 'System Design'],
      },
      tools: {
        type: [String],
        default: ['Git', 'GitHub Actions', 'Docker', 'Postman', 'Linux / Bash', 'AWS (S3, EC2)'],
      },
    },
    projects: [
      {
        title: { type: String, default: 'Distributed Task Queue & Job Scheduler' },
        techStack: { type: [String], default: ['Node.js', 'Redis', 'MongoDB', 'Docker'] },
        duration: { type: String, default: 'Jan 2026 - Mar 2026' },
        liveUrl: { type: String, default: 'https://scheduler-demo.dev' },
        repoUrl: { type: String, default: 'https://github.com/alex-chen/task-scheduler' },
        bullets: {
          type: [String],
          default: [
            'Architected a distributed background job processing pipeline handling 10,000+ tasks/min with Redis streams.',
            'Implemented exponential backoff retry policies, dead-letter queues, and deterministic deduplication mechanisms.',
            'Reduced average queue latency by 42% through optimized connection pooling and Redis cluster sharding.',
          ],
        },
      },
      {
        title: { type: String, default: 'High-Concurrency E-Commerce Microservices' },
        techStack: { type: [String], default: ['React', 'Express', 'PostgreSQL', 'Kafka'] },
        duration: { type: String, default: 'Aug 2025 - Nov 2025' },
        liveUrl: { type: String, default: '' },
        repoUrl: { type: String, default: 'https://github.com/alex-chen/ecom-engine' },
        bullets: {
          type: [String],
          default: [
            'Constructed 4 independent microservices communicating via Kafka event pub/sub with ACID transaction isolation.',
            'Designed normalized relational schemas and B+ tree indexing in PostgreSQL, sustaining 1,500 req/sec at peak load.',
            'Secured customer transactions with JWT authentication, role-based access control (RBAC), and rate limiting.',
          ],
        },
      },
    ],
    experience: [
      {
        company: { type: String, default: 'Razorpay Technologies' },
        role: { type: String, default: 'Software Engineering Intern' },
        location: { type: String, default: 'Bengaluru, India' },
        duration: { type: String, default: 'May 2025 - Jul 2025' },
        bullets: {
          type: [String],
          default: [
            'Engineered automated settlement reconciliation pipelines, trimming daily audit latency from 45 mins to 6 mins.',
            'Refactored legacy REST microservices into Go, improving CPU utilization by 28% across production pods.',
            'Wrote unit and integration test suites with 92% code coverage using Jest and Supertest, eliminating regressions.',
          ],
        },
      },
    ],
    achievements: {
      type: [String],
      default: [
        'Candidate Master (Rating 1920) on Codeforces; Knight (Rating 2085) on LeetCode with 600+ solved algorithmic problems.',
        'Secured Global Rank 142 in Google Code Jam 2025 Round 2 out of 35,000+ international participants.',
        'Won 1st Prize at Smart India Hackathon (SIH 2024) for developing an automated real-time disaster management telemetry dashboard.',
      ],
    },
    certifications: [
      {
        title: { type: String, default: 'AWS Certified Solutions Architect – Associate' },
        issuer: { type: String, default: 'Amazon Web Services (AWS)' },
        year: { type: String, default: '2025' },
        credentialUrl: { type: String, default: 'https://aws.amazon.com/verification' },
      },
    ],
    positions: [
      {
        role: { type: String, default: 'Lead Coordinator' },
        organization: { type: String, default: 'Google Developer Student Club (GDSC)' },
        duration: { type: String, default: '2024 - 2025' },
        description: { type: String, default: 'Led a team of 18 student developers; organized 12 hands-on workshops on DSA and System Design reaching 800+ attendees.' },
      },
    ],
    codingProfiles: {
      leetcode: { type: String, default: 'https://leetcode.com/u/alex_chen_dev/' },
      codeforces: { type: String, default: 'https://codeforces.com/profile/alex_chen' },
      gfg: { type: String, default: 'https://auth.geeksforgeeks.org/user/alex_chen' },
      github: { type: String, default: 'https://github.com/alex-chen' },
    },
    rawText: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
