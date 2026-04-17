const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  installmentNo: { type: Number, required: true },
  repaymentDate: { type: Date, required: true },
  
  installmentAmount: { type: Number, required: true },
  principal: { type: Number, required: true },
  interest: { type: Number, required: true },
  remainingPrincipal: { type: Number, required: true },
  
  paidStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'overdue'], 
    default: 'pending' 
  },
  amountCollected: { type: Number, default: 0 },
  paidAt: { type: Date }
});

module.exports = mongoose.model('Installment', installmentSchema);
