const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // null for broadcast notifications
    },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'admin'],
      default: 'student',
    },
    type: {
      type: String,
      enum: ['job_published', 'application_status', 'deadline_reminder', 'system'],
      default: 'system',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '',
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
