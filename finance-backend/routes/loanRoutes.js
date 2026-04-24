const express = require('express');
const router = express.Router();
const { applyLoan, getMyLoans, getAllLoans, approveLoan, rejectLoan, breakLoan, getLoanById } = require('../controllers/loanController');
const { generateLoanPDF } = require('../controllers/pdfController');
const { protect, authorize } = require('../middlewares/auth');

router.post('/apply', protect, applyLoan);
router.get('/my-loans', protect, getMyLoans);
router.get('/', protect, authorize('admin', 'subadmin'), getAllLoans);
router.get('/:id', protect, getLoanById);
router.put('/:id/approve', protect, authorize('admin'), approveLoan);
router.put('/:id/reject', protect, authorize('admin'), rejectLoan);
router.put('/:id/break', protect, authorize('admin'), breakLoan);
router.get('/:id/pdf', protect, generateLoanPDF);

module.exports = router;
