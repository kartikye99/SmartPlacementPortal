const Notification = require('../models/Notification');
const { getStoreStatus } = require('../config/db');

// In-Memory store for evaluation
const mockNotifications = [];

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
