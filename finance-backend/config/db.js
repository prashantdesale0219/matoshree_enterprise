const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Require model to ensure it's registered
    require('../models/Loan');
    
    // Drop problematic index if exists to allow sparse index recreation
    try {
      const Loan = mongoose.model('Loan');
      await Loan.collection.dropIndex('loanAccountNo_1');
      console.log('Old loanAccountNo index dropped successfully');
    } catch (err) {
      // Index might not exist or already be dropped, which is fine
      if (err.code !== 27) { // 27 is IndexNotFound
        console.log('Note: Index cleanup handled');
      }
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit process in production, let it retry or stay alive for Render
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
