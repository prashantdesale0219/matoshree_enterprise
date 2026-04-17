const User = require('../models/User');
const Loan = require('../models/Loan');
const Installment = require('../models/Installment');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeLoans = await Loan.countDocuments({ status: 'approved' });
    const pendingLoans = await Loan.countDocuments({ status: 'pending' });
    
    const pendingInstallments = await Installment.countDocuments({ paidStatus: 'pending' });
    
    // Simple revenue calculation
    const collectedData = await Installment.aggregate([
      { $match: { paidStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: "$amountCollected" } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeLoans,
        pendingLoans,
        pendingInstallments,
        totalRevenue: collectedData[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Active Loans (Approved)
// @route   GET /api/admin/active-loans
const getActiveLoans = async (req, res) => {
  try {
    // Populate user info for loans
    const loans = await Loan.find({ status: 'approved' })
      .populate('userId', 'name email mobile')
      .sort('-approvedAt');

    // For each loan, we can optionally fetch the next pending installment/EMI
    const loansWithEMI = await Promise.all(loans.map(async (loan) => {
      const nextInstallment = await Installment.findOne({ 
        loanId: loan._id, 
        paidStatus: 'pending' 
      }).sort('installmentNo');
      
      return {
        ...loan.toObject(),
        nextEMI: nextInstallment ? nextInstallment.installmentAmount : 0,
        nextEMIDate: nextInstallment ? nextInstallment.repaymentDate : null
      };
    }));

    res.json({ success: true, data: loansWithEMI });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update User Status (Active/Inactive)
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isActive }, 
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getAdminStats, 
  getAllUsers, 
  getActiveLoans, 
  updateUserStatus 
};
