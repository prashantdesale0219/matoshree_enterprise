const puppeteer = require('puppeteer');
const Loan = require('../models/Loan');
const Installment = require('../models/Installment');

// @desc    Generate Loan Receipt PDF
// @route   GET /api/loans/:id/pdf
const generateLoanPDF = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('userId', 'name email');
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

    const installments = await Installment.find({ loanId: loan._id }).sort(' installmentNo');

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // HTML Content for PDF (matches yellow card UI)
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #FFFDE7; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .company-name { font-size: 24px; font-weight: bold; text-transform: uppercase; }
            .card-title { background: #000; color: #fff; text-align: center; padding: 5px; margin: 10px 0; text-transform: uppercase; font-size: 14px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; font-size: 12px; margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background: #000; color: #fff; }
            .footer { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; font-size: 10px; }
            .sig-line { border-top: 1px solid #000; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">FinancePro Services Pvt Ltd</div>
            <p style="font-size: 10px;">Regd. Office: Financial Tower, No-27, Mumbai - 400001</p>
          </div>
          <div class="card-title">Loan Card - Cum Receipt</div>
          
          <div class="details-grid">
            <div>
              <strong>Customer:</strong> ${loan.customerName}<br>
              <strong>ID:</strong> ${loan._id.toString().slice(-6)}<br>
              <strong>Address:</strong> ${loan.address}
            </div>
            <div style="text-align: center;">
              <strong>Loan Acc No:</strong><br>
              <span style="font-size: 14px; color: #EAB308;">${loan.loanAccountNo || 'PENDING'}</span>
            </div>
            <div style="text-align: right;">
              <strong>Amount:</strong> ₹${loan.loanAmount}<br>
              <strong>Rate:</strong> ${loan.interestRate}% PA<br>
              <strong>Date:</strong> ${loan.disbursementDate ? new Date(loan.disbursementDate).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Inst No.</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${installments.map(inst => `
                <tr>
                  <td>${inst.installmentNo}</td>
                  <td>${new Date(inst.repaymentDate).toLocaleDateString()}</td>
                  <td>₹${inst.installmentAmount}</td>
                  <td>₹${inst.principal}</td>
                  <td>₹${inst.interest}</td>
                  <td>₹${inst.remainingPrincipal}</td>
                  <td>${inst.paidStatus}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div><div class="sig-line"></div>Authorized Signatory</div>
            <div><div class="sig-line"></div>Borrower Signature</div>
            <div><div class="sig-line"></div>Witness Signature</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(content);
    const pdf = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateLoanPDF };
