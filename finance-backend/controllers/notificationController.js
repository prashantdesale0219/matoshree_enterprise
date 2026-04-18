const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    let query = { recipient: req.user._id };

    // If admin, show both received and sent notifications
    if (req.user.role === 'admin') {
      query = {
        $or: [
          { recipient: req.user._id },
          { sender: req.user._id }
        ]
      };
    }

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .populate('sender', 'name')
      .populate('recipient', 'name');

    res.json({
      success: true,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send notification (Admin only)
// @route   POST /api/notifications
const sendNotification = async (req, res) => {
  try {
    const { recipientId, title, message, type } = req.body;

    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      title,
      message,
      type: type || 'admin'
    });

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  sendNotification,
  markAsRead
};
