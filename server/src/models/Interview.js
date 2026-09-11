const mongoose = require('mongoose');

const transcriptItemSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['ai', 'user'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: String,
      default: 'general',
    },
    company: {
      type: String,
      default: 'General Technical Mock',
    },
    jobTitle: {
      type: String,
      default: 'Software Development Engineer',
    },
    category: {
      type: String,
      enum: ['Technical', 'DSA', 'Core CS', 'HR & Behavioral', 'Comprehensive'],
      default: 'Technical',
    },
    mode: {
      type: String,
      enum: ['text', 'voice'],
      default: 'voice',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    recordingConsentGiven: {
      type: Boolean,
      default: true,
    },
    interviewIndex: {
      type: Number,
      default: 1,
    },
    transcript: [transcriptItemSchema],
    feedback: {
      overallScore: { type: Number, default: 0 },
      technicalScore: { type: Number, default: 0 },
      problemSolvingScore: { type: Number, default: 0 },
      communicationScore: { type: Number, default: 0 },
      confidenceScore: { type: Number, default: 0 },
      clarityScore: { type: Number, default: 0 },
      structureScore: { type: Number, default: 0 },
      concisenessScore: { type: Number, default: 0 },
      summary: { type: String, default: '' },
      strengths: { type: [String], default: [] },
      improvements: { type: [String], default: [] },
      weaknessAnalysis: {
        critical: [
          {
            topic: String,
            reason: String,
          },
        ],
        needsImprovement: [
          {
            topic: String,
            reason: String,
          },
        ],
        strong: [
          {
            topic: String,
            reason: String,
          },
        ],
      },
      recommendedPlan: [
        {
          action: String,
          category: String,
          topic: String,
          targetCount: Number,
          link: String,
          detail: String,
        },
      ],
      questionBreakdown: [
        {
          question: String,
          answer: String,
          rating: Number,
          feedback: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Interview', interviewSchema);
