const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company: {
      name: {
        type: String,
        required: [true, 'Please provide company name'],
        trim: true,
      },
      logo: {
        type: String,
        default: '',
      },
      website: {
        type: String,
        default: '',
      },
      industry: {
        type: String,
        default: 'Information Technology / Software',
      },
      description: {
        type: String,
        default: '',
      },
    },
    title: {
      type: String,
      required: [true, 'Please provide job/role title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide job description / JD'],
    },
    package: {
      type: String,
      required: [true, 'Please provide CTC package (e.g. 28 LPA)'],
    },
    packageLpa: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: 'Bengaluru / Hybrid',
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide application deadline'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'published',
    },
    eligibility: {
      minCgpa: {
        type: Number,
        default: 7.5,
      },
      allowedBranches: {
        type: [String],
        default: ['Computer Science & Engineering', 'Information Technology'],
      },
      eligibleBatches: {
        type: [Number],
        default: [2026],
      },
      maxBacklogs: {
        type: Number,
        default: 0,
      },
    },
    openings: {
      type: Number,
      default: 10,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    aiAnalysis: {
      type: Object,
      default: null, // Caches structured Gemini JD intelligence
    },
  },
  {
    timestamps: true,
  }
);

// Compound and filtering indexes
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ 'company.name': 1 });
jobSchema.index({ packageLpa: -1 });
jobSchema.index({ deadline: 1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
