const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'OA', 'Technical', 'HR', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    timeline: [
      {
        stage: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          default: '',
        },
        updatedBy: {
          type: String,
          default: 'Placement Cell',
        },
      },
    ],
    resumeUrl: {
      type: String,
      default: '',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by the same student for the same job
applicationSchema.index({ job: 1, student: 1 }, { unique: true });
applicationSchema.index({ student: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ appliedAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
