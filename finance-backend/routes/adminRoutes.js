const express = require('express');
const router = express.Router();
const { 
  getAdminStats, 
  getAllUsers, 
  getActiveLoans, 
  updateUserStatus 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);
router.get('/active-loans', protect, authorize('admin'), getActiveLoans);
router.put('/users/:id/status', protect, authorize('admin'), updateUserStatus);

module.exports = router;
