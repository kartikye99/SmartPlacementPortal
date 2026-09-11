const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    title: {
      type: String,
      required: [true, 'Please provide question title'],
      trim: true,
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'GeeksforGeeks'],
      required: [true, 'Please specify platform (LeetCode or GeeksforGeeks)'],
    },
    url: {
      type: String,
      required: [true, 'Please provide authentic problem URL'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      default: 'Medium',
    },
    topics: {
      type: [String],
      required: true,
      default: [],
    },
    companies: {
      type: [String],
      required: true,
      default: [],
    },
    frequency: {
      type: Number,
      default: 70,
      min: 1,
      max: 100,
    },
    acceptanceRate: {
      type: Number,
      default: 50.0,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance filtering & ranking queries
questionSchema.index({ companies: 1, topics: 1, difficulty: 1 });
questionSchema.index({ platform: 1 });
questionSchema.index({ frequency: -1 });

module.exports = mongoose.model('Question', questionSchema);
