const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanAccountNo: { type: String, unique: true },
  
  customerName: { type: String, required: true },
  husbandName: { type: String },
  fatherName: { type: String },
  coApplicantName: { type: String },
  address: { type: String, required: true },
  liveLocation: { type: String },
  
  loanAmount: { type: Number, required: true },
  purpose: { type: String, required: true },
  loanType: { type: String, required: true },
  
  bankName: { type: String, required: true },
  bankAccountNo: { type: String, required: true },
  beneficiaryName: { type: String },
  
  mobileNumber: { type: String, required: true },
  nomineeMobileNumber: { type: String },
  
  repaymentDay: { type: String },
  repaymentFrequency: { type: String, enum: ['weekly', 'monthly'], default: 'monthly' },
  interestRate: { type: Number, default: 23.60 },
  
  loanCycle: { type: Number, default: 1 },
  lendingType: { type: String },
  disbursementDate: { type: Date },
  
  customerImage: { type: String }, // URL to image
  aadharFront: { type: String }, // URL to Aadhar Front image
  aadharBack: { type: String },  // URL to Aadhar Back image
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectionReason: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);
