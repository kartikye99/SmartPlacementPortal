const Job = require('../models/Job');
const Application = require('../models/Application');
const { getStoreStatus } = require('../config/db');
const { addMockNotification } = require('./notificationController');
const { analyzeJobDescription, generateDeterministicAnalysis } = require('../services/geminiService');

// Mock data store for turnkey evaluation
const mockJobs = [
  {
    _id: 'job-001',
    company: {
      name: 'Google',
      logo: 'G',
      website: 'https://careers.google.com',
      industry: 'Internet & Cloud Services',
      description: 'Google’s mission is to organize the world’s information and make it universally accessible and useful.',
    },
    title: 'Associate Software Engineer',
    description: `As an Associate Software Engineer at Google, you will work on core products that impact billions of users worldwide.
Key Responsibilities:
- Design, test, deploy, and maintain high-performance, fault-tolerant backend services and user interfaces.
- Collaborate with engineers, product managers, and UX designers to deliver state-of-the-art tech.
- Write clean, maintainable, and thoroughly unit-tested code in Go, C++, Java, or Python.
- Solve algorithmic scalability challenges in distributed systems.`,
    package: '32 LPA',
    packageLpa: 32,
    location: 'Bengaluru / Hyderabad',
    deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    eligibility: {
      minCgpa: 8.0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
      eligibleBatches: [2026],
      maxBacklogs: 0,
    },
    openings: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-002',
    company: {
      name: 'Microsoft',
      logo: 'M',
      website: 'https://careers.microsoft.com',
      industry: 'Enterprise Software & Cloud',
      description: 'Microsoft empowers every person and every organization on the planet to achieve more through intelligent cloud and edge computing.',
    },
    title: 'Software Development Engineer',
    description: `Microsoft is hiring SDEs for Azure, Microsoft 365, and Developer Technologies divisions.
Key Responsibilities:
- Build reliable, cloud-native services using C#, TypeScript, Python, or Go.
- Participate in design architecture discussions and CI/CD pipelines with Azure DevOps.
- Optimize high-throughput data processing and security compliance across enterprise environments.`,
    package: '28 LPA',
    packageLpa: 28,
    location: 'Hyderabad / Noida / Bengaluru',
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    eligibility: {
      minCgpa: 7.5,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      eligibleBatches: [2026],
      maxBacklogs: 0,
    },
    openings: 18,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-003',
    company: {
      name: 'Amazon',
      logo: 'A',
      website: 'https://amazon.jobs',
      industry: 'E-Commerce, Cloud & AI',
      description: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.',
    },
    title: 'Applied Scientist / SDE',
    description: `Join Amazon Prime Video or AWS Cloud Infrastructure teams as an SDE.
Key Responsibilities:
- Build low-latency microservices with multi-region replication.
- Implement machine learning inference pipelines and distributed cache mechanisms.
- Drive automated unit, integration, and load testing.`,
    package: '34 LPA',
    packageLpa: 34,
    location: 'Bengaluru',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    eligibility: {
      minCgpa: 8.5,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology'],
      eligibleBatches: [2026],
      maxBacklogs: 0,
    },
    openings: 15,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-004',
    company: {
      name: 'Goldman Sachs',
      logo: 'GS',
      website: 'https://goldmansachs.com/careers',
      industry: 'Investment Banking & Fintech',
      description: 'The Goldman Sachs Group is a leading global investment banking, securities and investment management firm.',
    },
    title: 'Analyst - Engineering',
    description: `Work alongside quantitative researchers and financial engineers building mission-critical trading and risk engines.
Key Responsibilities:
- Engineer high-frequency financial messaging systems and analytics tools.
- Implement algorithmic order execution algorithms with sub-millisecond guarantees.
- Ensure strict regulatory compliance, encryption, and auditability.`,
    package: '26 LPA',
    packageLpa: 26,
    location: 'Bengaluru',
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    eligibility: {
      minCgpa: 8.0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electrical Engineering'],
      eligibleBatches: [2026],
      maxBacklogs: 0,
    },
    openings: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-005',
    company: {
      name: 'Adobe',
      logo: 'AD',
      website: 'https://adobe.com/careers',
      industry: 'Creative & Digital Media',
      description: 'Adobe is changing the world through digital experiences and creative software.',
    },
    title: 'Member of Technical Staff',
    description: `Develop web and desktop creative tooling with WebAssembly, WebGL, and modern frontend frameworks.
Key Responsibilities:
- Build next-generation generative AI tools inside Photoshop and Illustrator web ecosystems.
- Optimize vector mathematics and client-side memory caching.`,
    package: '24 LPA',
    packageLpa: 24,
    location: 'Noida / Bengaluru',
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    eligibility: {
      minCgpa: 7.8,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      eligibleBatches: [2026],
      maxBacklogs: 1,
    },
    openings: 6,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'job-006',
    company: {
      name: 'Oracle',
      logo: 'O',
      website: 'https://oracle.com/careers',
      industry: 'Cloud Systems & Database',
      description: 'Oracle Cloud Infrastructure (OCI) delivers high-performance computing power to run enterprise workloads.',
    },
    title: 'Cloud Systems Engineer',
    description: `Drive automated infrastructure deployment and virtualization on Oracle Cloud Infrastructure (OCI).`,
    package: '19 LPA',
    packageLpa: 19,
    location: 'Hyderabad',
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'draft',
    eligibility: {
      minCgpa: 7.0,
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication', 'Electrical Engineering'],
      eligibleBatches: [2026],
      maxBacklogs: 1,
    },
    openings: 20,
    createdAt: new Date().toISOString(),
  },
];

const findMockJobById = (id) => mockJobs.find((j) => j._id === id);

// @desc    Get all jobs (with search, branch filter, eligibility)
// @route   GET /api/jobs
// @access  Private (Student & Admin)
const getJobs = async (req, res) => {
  try {
    const { search, branch, minCgpa, status, minPackage } = req.query;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      let filtered = [...mockJobs];

      // If student, only show published jobs (unless query specifically requests)
      if (req.user && req.user.role === 'student') {
        filtered = filtered.filter((j) => j.status === 'published');
      } else if (status) {
        filtered = filtered.filter((j) => j.status === status);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (j) =>
            j.title.toLowerCase().includes(q) ||
            j.company.name.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q)
        );
      }

      if (branch && branch !== 'all') {
        filtered = filtered.filter((j) =>
          j.eligibility.allowedBranches.some((b) => b.toLowerCase().includes(branch.toLowerCase()))
        );
      }

      if (minCgpa) {
        filtered = filtered.filter((j) => j.eligibility.minCgpa <= Number(minCgpa));
      }

      if (minPackage) {
        filtered = filtered.filter((j) => j.packageLpa >= Number(minPackage));
      }

      return res.json({
        success: true,
        count: filtered.length,
        jobs: filtered,
      });
    }

    // MongoDB Flow
    let query = {};
    if (req.user && req.user.role === 'student') {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'company.name': { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (branch && branch !== 'all') {
      query['eligibility.allowedBranches'] = { $regex: branch, $options: 'i' };
    }

    if (minCgpa) {
      query['eligibility.minCgpa'] = { $lte: Number(minCgpa) };
    }

    if (minPackage) {
      query.packageLpa = { $gte: Number(minPackage) };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const job = findMockJobById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      return res.json({ success: true, job });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job/drive (Admin only)
// @route   POST /api/jobs
// @access  Private/Admin
const createJob = async (req, res) => {
  try {
    const {
      company,
      title,
      description,
      package: pkg,
      location,
      deadline,
      status,
      eligibility,
      openings,
    } = req.body;

    if (!company?.name || !title || !description || !pkg || !deadline) {
      return res.status(400).json({ message: 'Please provide company name, job title, JD, package, and deadline.' });
    }

    // Extract numeric LPA
    const numMatch = pkg.match(/\d+(\.\d+)?/);
    const packageLpa = numMatch ? parseFloat(numMatch[0]) : 10;

    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const newJob = {
        _id: `job-${Date.now()}`,
        company: {
          name: company.name,
          logo: company.logo || company.name.charAt(0).toUpperCase(),
          website: company.website || '',
          industry: company.industry || 'Information Technology',
          description: company.description || '',
        },
        title,
        description,
        package: pkg,
        packageLpa,
        location: location || 'Bengaluru / Hybrid',
        deadline: new Date(deadline).toISOString(),
        status: status || 'published',
        eligibility: {
          minCgpa: Number(eligibility?.minCgpa) || 7.0,
          allowedBranches: eligibility?.allowedBranches || ['Computer Science & Engineering', 'Information Technology'],
          eligibleBatches: eligibility?.eligibleBatches || [2026],
          maxBacklogs: Number(eligibility?.maxBacklogs) || 0,
        },
        openings: Number(openings) || 10,
        createdAt: new Date().toISOString(),
      };

      mockJobs.unshift(newJob);

      // If created as published, notify all students!
      if (newJob.status === 'published') {
        addMockNotification({
          title: `New Placement Drive: ${newJob.company.name}`,
          message: `${newJob.company.name} is hiring for ${newJob.title} (${newJob.package}). Check eligibility and apply before deadline.`,
          type: 'job_published',
          link: '/student/jobs',
          targetRole: 'student',
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Job drive created successfully',
        job: newJob,
      });
    }

    // MongoDB Flow
    const newJob = await Job.create({
      company: {
        name: company.name,
        logo: company.logo || company.name.charAt(0).toUpperCase(),
        website: company.website || '',
        industry: company.industry || 'Information Technology',
        description: company.description || '',
      },
      title,
      description,
      package: pkg,
      packageLpa,
      location: location || 'Bengaluru / Hybrid',
      deadline: new Date(deadline),
      status: status || 'published',
      eligibility: {
        minCgpa: Number(eligibility?.minCgpa) || 7.0,
        allowedBranches: eligibility?.allowedBranches || ['Computer Science & Engineering', 'Information Technology'],
        eligibleBatches: eligibility?.eligibleBatches || [2026],
        maxBacklogs: Number(eligibility?.maxBacklogs) || 0,
      },
      openings: Number(openings) || 10,
      postedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Job drive created successfully',
      job: newJob,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job/drive (Admin only)
// @route   PUT /api/jobs/:id
// @access  Private/Admin
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const job = findMockJobById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      if (req.body.company) Object.assign(job.company, req.body.company);
      if (req.body.title) job.title = req.body.title;
      if (req.body.description) job.description = req.body.description;
      if (req.body.package) {
        job.package = req.body.package;
        const numMatch = req.body.package.match(/\d+(\.\d+)?/);
        job.packageLpa = numMatch ? parseFloat(numMatch[0]) : job.packageLpa;
      }
      if (req.body.location) job.location = req.body.location;
      if (req.body.deadline) job.deadline = new Date(req.body.deadline).toISOString();
      if (req.body.status) job.status = req.body.status;
      if (req.body.openings !== undefined) job.openings = Number(req.body.openings);
      if (req.body.eligibility) Object.assign(job.eligibility, req.body.eligibility);

      return res.json({
        success: true,
        message: 'Job drive updated successfully',
        job,
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    Object.assign(job, req.body);
    if (req.body.package) {
      const numMatch = req.body.package.match(/\d+(\.\d+)?/);
      job.packageLpa = numMatch ? parseFloat(numMatch[0]) : job.packageLpa;
    }

    await job.save();
    return res.json({
      success: true,
      message: 'Job drive updated successfully',
      job,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job/drive (Admin only)
// @route   DELETE /api/jobs/:id
// @access  Private/Admin
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const index = mockJobs.findIndex((j) => j._id === id);
      if (index === -1) {
        return res.status(404).json({ message: 'Job not found' });
      }
      mockJobs.splice(index, 1);
      return res.json({ success: true, message: 'Job drive deleted successfully' });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(id);
    await Application.deleteMany({ job: id });

    return res.json({ success: true, message: 'Job drive deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle publish status (draft <-> published)
// @route   PUT /api/jobs/:id/publish
// @access  Private/Admin
const togglePublishJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const job = findMockJobById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const nextStatus = job.status === 'published' ? 'draft' : 'published';
      job.status = nextStatus;

      if (nextStatus === 'published') {
        addMockNotification({
          title: `Drive Published: ${job.company.name}`,
          message: `${job.company.name} drive for ${job.title} (${job.package}) is now open for student applications!`,
          type: 'job_published',
          link: '/student/jobs',
          targetRole: 'student',
        });
      }

      return res.json({
        success: true,
        message: `Job drive is now ${nextStatus}`,
        job,
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.status = job.status === 'published' ? 'draft' : 'published';
    await job.save();

    return res.json({
      success: true,
      message: `Job drive is now ${job.status}`,
      job,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get job preparation workspace & AI JD intelligence (with persistent caching)
// @route   GET /api/jobs/:id/prepare
// @access  Private
const getJobPreparation = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const job = findMockJobById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job drive not found' });
      }

      // CRITICAL CACHE CHECK: If already analyzed, return cached analysis immediately!
      if (job.aiAnalysis) {
        return res.json({
          success: true,
          cached: true,
          job,
          analysis: job.aiAnalysis,
        });
      }

      // First time analysis: compute once and cache permanently on job record
      const analysis = await analyzeJobDescription(job);
      job.aiAnalysis = analysis;

      return res.json({
        success: true,
        cached: false,
        job,
        analysis,
      });
    }

    // MongoDB Flow
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: 'Job drive not found' });
    }

    // CRITICAL CACHE CHECK
    if (job.aiAnalysis) {
      return res.json({
        success: true,
        cached: true,
        job,
        analysis: job.aiAnalysis,
      });
    }

    // First time analysis
    const analysis = await analyzeJobDescription(job);
    job.aiAnalysis = analysis;
    await job.save();

    return res.json({
      success: true,
      cached: false,
      job,
      analysis,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  togglePublishJob,
  getJobPreparation,
  mockJobs,
  findMockJobById,
};
