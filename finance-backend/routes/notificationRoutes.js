const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  sendNotification, 
  markAsRead 
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/', protect, getNotifications);
router.post('/', protect, authorize('admin'), sendNotification);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
