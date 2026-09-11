const Notification = require('../models/Notification');
const { getStoreStatus } = require('../config/db');

// In-Memory store for evaluation
const mockNotifications = [
  {
    _id: 'notif-001',
    recipient: 'mock-student-001',
    targetRole: 'student',
    type: 'job_published',
    title: 'Google Campus Drive 2026',
    message: 'Google India has published Associate Software Engineer drive (32 LPA). Applications close Sept 18.',
    link: '/student/jobs',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif-002',
    recipient: 'mock-student-001',
    targetRole: 'student',
    type: 'application_status',
    title: 'Application Shortlisted: Google',
    message: 'Congratulations! Your profile has been Shortlisted for Google Associate Software Engineer. Technical Round 2 scheduled.',
    link: '/student/applications',
    read: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'notif-003',
    recipient: 'mock-student-001',
    targetRole: 'student',
    type: 'deadline_reminder',
    title: 'Deadline Approaching: Microsoft Drive',
    message: 'Only 3 days left to submit application for Microsoft SDE (28 LPA). Complete your application now.',
    link: '/student/jobs',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

const addMockNotification = (notif) => {
  const newNotif = {
    _id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...notif,
  };
  mockNotifications.unshift(newNotif);
  return newNotif;
};

// @desc    Get current user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const userRole = req.user.role;
      const userId = req.user._id;

      const userNotifs = mockNotifications.filter(
        (n) =>
          n.recipient === userId ||
          n.targetRole === 'all' ||
          n.targetRole === userRole
      );

      const unreadCount = userNotifs.filter((n) => !n.read).length;

      return res.json({
        success: true,
        count: userNotifs.length,
        unreadCount,
        notifications: userNotifs,
      });
    }

    // MongoDB Flow
    const userRole = req.user.role;
    const userId = req.user._id;

    const notifications = await Notification.find({
      $or: [
        { recipient: userId },
        { targetRole: 'all' },
        { targetRole: userRole },
      ],
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const notif = mockNotifications.find((n) => n._id === id);
      if (notif) {
        notif.read = true;
      }
      return res.json({ success: true, message: 'Notification marked as read' });
    }

    await Notification.findByIdAndUpdate(id, { read: true });
    return res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const { isMockStoreActive } = getStoreStatus();

    if (isMockStoreActive) {
      const userRole = req.user.role;
      const userId = req.user._id;

      mockNotifications.forEach((n) => {
        if (
          n.recipient === userId ||
          n.targetRole === 'all' ||
          n.targetRole === userRole
        ) {
          n.read = true;
        }
      });

      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    const userRole = req.user.role;
    const userId = req.user._id;

    await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { targetRole: 'all' },
          { targetRole: userRole },
        ],
      },
      { read: true }
    );

    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  addMockNotification,
  mockNotifications,
};
