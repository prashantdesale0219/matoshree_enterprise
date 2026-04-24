const puppeteer = require('puppeteer');
const Loan = require('../models/Loan');
const Installment = require('../models/Installment');

// @desc    Generate Loan Receipt PDF
// @route   GET /api/loans/:id/pdf
const generateLoanPDF = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('userId', 'name email');
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });

    const installments = await Installment.find({ loanId: loan._id }).sort('installmentNo');

    console.log(`Generating PDF for Loan: ${loan.loanAccountNo || loan._id}`);

    let browser;
    try {
      // Try to launch with standard options first
      browser = await puppeteer.launch({ 
        headless: "shell",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    } catch (launchError) {
      console.log('Standard launch failed, trying with explicit executable path...');
      try {
        const executablePath = puppeteer.executablePath();
        browser = await puppeteer.launch({ 
          executablePath,
          headless: "shell",
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
      } catch (secondError) {
        console.error('All Puppeteer launch attempts failed:', secondError);
        throw new Error('PDF Engine could not start. Try running your terminal as Administrator.');
      }
    }

    const page = await browser.newPage();

    // HTML Content for PDF (matches yellow card UI)
    const content = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #FFFDE7; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .company-name { font-size: 24px; font-weight: bold; text-transform: uppercase; color: #000; }
            .subtitle { font-size: 10px; font-weight: bold; color: #666; letter-spacing: 2px; }
            .card-title { background: #000; color: #fff; text-align: center; padding: 8px; margin: 15px 0; text-transform: uppercase; font-size: 14px; letter-spacing: 4px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; font-size: 11px; margin-top: 20px; }
            .acc-no { font-size: 16px; font-weight: 900; color: #b45309; }
            table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 10px; background: white; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: center; }
            th { background: #111827; color: #fff; text-transform: uppercase; font-size: 9px; }
            tr:nth-child(even) { background: #f9fafb; }
            .footer { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr 1fr; text-align: center; font-size: 9px; font-weight: bold; }
            .sig-line { border-top: 2px solid #111827; margin: 0 10px 10px 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Matoshree Enterprise</div>
            <div class="subtitle">FINANCE SOLUTION</div>
          </div>
          <div class="card-title">Loan Card - Cum Receipt</div>
          
          <div class="details-grid">
                    <div>
                      <strong style="color: #666; font-size: 9px; text-transform: uppercase;">Customer Details</strong><br>
                      <div style="display: flex; gap: 10px; align-items: flex-start; margin-top: 5px;">
                        ${loan.customerImage ? `<img src="${loan.customerImage}" style="width: 60px; height: 70px; object-fit: cover; border: 1px solid #000; border-radius: 4px;" />` : ''}
                        <div>
                          <span style="font-size: 13px; font-weight: bold;">${loan.customerName || 'N/A'}</span><br>
                          ID: ${loan._id.toString().slice(-10).toUpperCase()}<br>
                          Address: ${loan.address || 'N/A'}
                        </div>
                      </div>
                    </div>
            <div style="text-align: center;">
              <strong style="color: #666; font-size: 9px; text-transform: uppercase;">Loan Account Number</strong><br>
              <span class="acc-no">${loan.loanAccountNo || 'PENDING'}</span>
            </div>
            <div style="text-align: right;">
              <strong style="color: #666; font-size: 9px; text-transform: uppercase;">Loan Summary</strong><br>
              Amount: <strong>₹${(loan.loanAmount || 0).toLocaleString()}</strong><br>
              Rate: ${loan.interestRate || 23.6}% PA<br>
              Date: ${loan.disbursementDate ? new Date(loan.disbursementDate).toLocaleDateString() : 'Pending'}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Inst No.</th>
                <th>Repayment Date</th>
                <th>Amount</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>O/S Principal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${installments.length > 0 ? installments.map(inst => `
                <tr>
                  <td>${inst.installmentNo}</td>
                  <td>${new Date(inst.repaymentDate).toLocaleDateString()}</td>
                  <td>₹${(inst.installmentAmount || 0).toLocaleString()}</td>
                  <td>₹${(inst.principal || 0).toLocaleString()}</td>
                  <td>₹${(inst.interest || 0).toLocaleString()}</td>
                  <td>₹${(inst.remainingPrincipal || 0).toLocaleString()}</td>
                  <td style="text-transform: capitalize; font-weight: bold; color: ${inst.paidStatus === 'paid' ? '#059669' : '#d97706'}">
                    ${inst.paidStatus || 'Pending'}
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="7">No installments found</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            <div><div class="sig-line"></div>AUTHORIZED SIGNATORY</div>
            <div><div class="sig-line"></div>BORROWER SIGNATURE</div>
            <div><div class="sig-line"></div>WITNESS SIGNATURE</div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(content, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ 
      format: 'A4', 
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();
    console.log(`PDF Generated successfully for Loan: ${loan.loanAccountNo}`);

    res.contentType("application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'PDF Generation failed: ' + error.message });
  }
};

module.exports = { generateLoanPDF };
