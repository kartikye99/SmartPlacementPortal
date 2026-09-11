const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    cacheKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    resumeHash: {
      type: String,
      required: true,
      index: true,
    },
    jdHash: {
      type: String,
      required: true,
      index: true,
    },
    jobId: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    jobTitle: {
      type: String,
      default: '',
    },
    matchPercentage: {
      type: Number,
      required: true,
      default: 75,
    },
    strongSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    atsScore: {
      type: Number,
      default: 82,
    },
    formattingScore: {
      type: Number,
      default: 88,
    },
    contentQualityScore: {
      type: Number,
      default: 80,
    },
    projectsScore: {
      type: Number,
      default: 85,
    },
    achievementsScore: {
      type: Number,
      default: 84,
    },
    summary: {
      type: String,
      default: '',
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    atsKeywordsFound: {
      type: [String],
      default: [],
    },
    atsKeywordsMissing: {
      type: [String],
      default: [],
    },
    actionVerbsFound: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    engine: {
      type: String,
      default: 'Gemini 2.5 Flash + ATS NLP',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
