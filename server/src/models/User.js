const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      default: 'Computer Science & Engineering',
    },
    rollNumber: {
      type: String,
      default: 'CS2026-089',
    },
    cgpa: {
      type: Number,
      default: 8.8,
      min: 0,
      max: 10,
    },
    graduationYear: {
      type: Number,
      default: 2026,
    },
    backlogs: {
      type: Number,
      default: 0,
      min: 0,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    skills: {
      type: [String],
      default: ['React', 'Node.js', 'MongoDB', 'Python', 'Tailwind CSS', 'System Design'],
    },
    solvedQuestions: {
      type: [String],
      default: ['q-graph-001', 'q-tree-001', 'q-arr-001'],
    },
    readinessScore: {
      type: Number,
      default: 88,
      min: 0,
      max: 100,
    },
    placementStatus: {
      type: String,
      enum: ['Placed', 'In Process', 'Not Started'],
      default: 'In Process',
    },
    bio: {
      type: String,
      default: 'Aspiring Full-Stack Software Engineer with strong problem-solving and web development fundamentals.',
    },
    github: {
      type: String,
      default: 'https://github.com/alex-chen',
    },
    linkedin: {
      type: String,
      default: 'https://linkedin.com/in/alex-chen-dev',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ role: 1 });
userSchema.index({ readinessScore: -1 });
userSchema.index({ department: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;
