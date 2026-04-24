const Loan = require('../models/Loan');
const Installment = require('../models/Installment');
const User = require('../models/User');

// @desc    Apply for a loan
// @route   POST /api/loans/apply
const applyLoan = async (req, res) => {
  try {
    const { 
      customerName, 
      husbandName, 
      fatherName, 
      coApplicantName, 
      permanentAddress, 
      liveLocation, 
      customerMobile, 
      nomineeMobile, 
      loanAmount, 
      loanType, 
      purpose, 
      repaymentFrequency, 
      preferredRepaymentDay, 
      bankName, 
      bankAccountNo, 
      centreGroupNos,
      aadharFront,
      aadharBack,
      livePhoto
    } = req.body;

    // Update user's profile pic with the live photo
    await User.findByIdAndUpdate(req.user._id, { profilePic: livePhoto });

    // Map frontend fields to backend model fields
    const loanData = {
      userId: req.user._id,
      customerName,
      husbandName,
      fatherName,
      coApplicantName,
      address: permanentAddress, // Map permanentAddress -> address
      liveLocation,
      mobileNumber: customerMobile, // Map customerMobile -> mobileNumber
      nomineeMobileNumber: nomineeMobile, // Map nomineeMobile -> nomineeMobileNumber
      loanAmount: Number(loanAmount),
      loanType,
      purpose,
      repaymentFrequency: repaymentFrequency === 'Monthly / Cash' ? 'monthly' : 'weekly', // Map enum
      repaymentDay: preferredRepaymentDay,
      bankName,
      bankAccountNo,
      centreGroupNos,
      aadharFront,
      aadharBack,
      customerImage: livePhoto, // Save live photo as customer image
      status: 'pending'
    };

    const loan = await Loan.create(loanData);
    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's loans
// @route   GET /api/loans/my-loans
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id }).sort('-createdAt');
    
    // For each loan, get pending installments count
    const loansWithPendingCount = await Promise.all(loans.map(async (loan) => {
      const pendingCount = await Installment.countDocuments({ 
        loanId: loan._id, 
        paidStatus: 'pending' 
      });
      return {
        ...loan.toObject(),
        pendingEMIs: pendingCount
      };
    }));

    res.json({ success: true, count: loans.length, data: loansWithPendingCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all loans (Admin)
// @route   GET /api/loans
const getAllLoans = async (req, res) => {
  try {
    const status = req.query.status;
    const filter = status ? { status } : {};
    const loans = await Loan.find(filter).populate('userId', 'name email');
    res.json({ success: true, count: loans.length, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve loan & Generate Installments
// @route   PUT /api/loans/:id/approve
const approveLoan = async (req, res) => {
  try {
    const { loanAccountNo, disbursementDate, interestRate, durationMonths } = req.body;
    
    let loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

    loan.status = 'approved';
    loan.loanAccountNo = loanAccountNo;
    loan.disbursementDate = disbursementDate;
    loan.approvedBy = req.user._id;
    loan.approvedAt = Date.now();
    
    await loan.save();

    // Logic to generate installments
    const amount = loan.loanAmount;
    const rate = interestRate || 23.60;
    const months = durationMonths || 24;
    
    // Simple EMI Calculation (for demo)
    const monthlyRate = (rate / 100) / 12;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    let balance = amount;
    const installments = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance -= principal;

      const repaymentDate = new Date(disbursementDate);
      repaymentDate.setMonth(repaymentDate.getMonth() + i);

      installments.push({
        loanId: loan._id,
        installmentNo: i,
        repaymentDate,
        installmentAmount: emi.toFixed(2),
        principal: principal.toFixed(2),
        interest: interest.toFixed(2),
        remainingPrincipal: Math.max(0, balance).toFixed(2),
        paidStatus: 'pending'
      });
    }

    await Installment.insertMany(installments);

    res.json({ success: true, message: 'Loan approved and installments generated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject loan
// @route   PUT /api/loans/:id/reject
const rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

    loan.status = 'rejected';
    loan.rejectedBy = req.user._id;
    loan.rejectedAt = Date.now();
    
    await loan.save();

    res.json({ success: true, message: 'Loan application rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Break/Close active loan
// @route   PUT /api/loans/:id/break
const breakLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

    if (loan.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Only active approved loans can be broken' });
    }

    loan.status = 'closed';
    loan.closedAt = Date.now();
    loan.closureReason = 'Broken/Closed by Admin';
    
    await loan.save();

    // Mark all pending installments as 'cancelled' or similar if needed
    await Installment.updateMany(
      { loanId: loan._id, paidStatus: 'pending' },
      { paidStatus: 'cancelled' }
    );

    res.json({ success: true, message: 'Loan has been broken/closed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get loan by ID
// @route   GET /api/loans/:id
const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('userId', 'name email mobile');
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    const installments = await Installment.find({ loanId: req.params.id }).sort('installmentNo');
    
    res.json({ 
      success: true, 
      data: { 
        loan, 
        installments 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyLoan, getMyLoans, getAllLoans, approveLoan, rejectLoan, breakLoan, getLoanById };
