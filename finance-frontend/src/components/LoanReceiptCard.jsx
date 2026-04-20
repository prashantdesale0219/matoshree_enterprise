import { Download, Printer, CheckCircle2, PhoneCall } from 'lucide-react';

const LoanReceiptCard = ({ data }) => {
  if (!data) return null;
  const { loan, installments } = data;

  const totalInstallmentAmount = installments.reduce((sum, i) => sum + i.installmentAmount, 0);
  const totalPrincipal = installments.reduce((sum, i) => sum + i.principal, 0);
  const totalInterest = installments.reduce((sum, i) => sum + i.interest, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="yellow-card !p-0 overflow-hidden border-2 border-yellow-500 shadow-2xl bg-[#FFFDE7]">
        {/* Top Header - Company Info */}
        <div className="p-6 border-b border-yellow-200 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-2xl">ME</div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 uppercase">Matoshree Enterprise</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Finance Solution</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Branch Address</p>
              <p className="text-xs font-bold text-slate-600">4430 - LIMBAYAT, SURAT</p>
              <p className="text-xs font-medium text-slate-500">Toll Free: 1800 3010 2121</p>
            </div>
          </div>
        </div>

        {/* LOAN CARD - CUM RECEIPT Header */}
        <div className="bg-slate-900 text-white py-2 text-center">
          <h2 className="text-sm font-black tracking-[0.3em] uppercase">Loan Card - Cum Receipt</h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: Customer & Loan Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="space-y-3">
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Customer Name & ID</p>
                <p className="text-sm font-bold text-slate-900">{loan?.customerName || 'N/A'} ({loan?._id?.slice(-10).toUpperCase()})</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Husband/Father Name</p>
                <p className="text-sm font-bold text-slate-900">{loan?.husbandName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Customer Address</p>
                <p className="text-[11px] font-bold text-slate-700 leading-tight">
                  {loan?.address || 'N/A'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Disb. Date</p>
                  <p className="text-sm font-bold text-slate-900">
                    {loan?.disbursementDate ? new Date(loan.disbursementDate).toLocaleDateString() : 'Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Loan Amount</p>
                  <p className="text-sm font-bold text-slate-900">₹{loan?.loanAmount?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 rounded-xl border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                <img 
                  src={loan?.customerImage || `https://api.dicebear.com/7.x/initials/svg?seed=${loan?.customerName}`} 
                  alt="Customer" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-slate-500 uppercase">Loan Acc No</p>
                <p className="text-sm font-black text-primary-dark">{loan?.loanAccountNo || 'PENDING'}</p>
              </div>
            </div>

            <div className="space-y-3 text-right md:text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Mobile Number</p>
                  <p className="text-sm font-bold text-slate-900">{loan?.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Repayment Frequency</p>
                  <p className="text-sm font-bold text-slate-900 capitalize">{loan?.repaymentFrequency} / {loan?.repaymentDay || 'Any'}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Purpose</p>
                <p className="text-sm font-bold text-slate-900">{loan?.purpose}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Annualized Int. Rate</p>
                <p className="text-sm font-bold text-slate-900">{loan?.interestRate}% PA</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Bank Name & Acct No.</p>
                <p className="text-sm font-bold text-slate-900">{loan?.bankName} - {loan?.bankAccountNo}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Installment Schedule Table */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest text-center border-b border-yellow-200 pb-1">Installment Schedule</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white uppercase font-bold">
                    <th className="px-2 py-2 border border-slate-700">Inst No.</th>
                    <th className="px-2 py-2 border border-slate-700">Repayment Date</th>
                    <th className="px-2 py-2 border border-slate-700">Inst. Amount</th>
                    <th className="px-2 py-2 border border-slate-700">Principal</th>
                    <th className="px-2 py-2 border border-slate-700">Interest</th>
                    <th className="px-2 py-2 border border-slate-700">O/S Principal</th>
                    <th className="px-2 py-2 border border-slate-700">Paid Status</th>
                    <th className="px-2 py-2 border border-slate-700">Amt Collected</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-slate-800">
                  {installments.map((inst) => (
                    <tr key={inst._id} className="text-center hover:bg-yellow-100 transition-colors">
                      <td className="px-2 py-1.5 border border-yellow-200">{inst.installmentNo}</td>
                      <td className="px-2 py-1.5 border border-yellow-200">{new Date(inst.repaymentDate).toLocaleDateString()}</td>
                      <td className="px-2 py-1.5 border border-yellow-200">₹{inst.installmentAmount?.toLocaleString()}</td>
                      <td className="px-2 py-1.5 border border-yellow-200">₹{inst.principal?.toLocaleString()}</td>
                      <td className="px-2 py-1.5 border border-yellow-200">₹{inst.interest?.toLocaleString()}</td>
                      <td className="px-2 py-1.5 border border-yellow-200">₹{inst.remainingPrincipal?.toLocaleString()}</td>
                      <td className="px-2 py-1.5 border border-yellow-200">
                        <span className={`px-2 py-0.5 rounded text-[9px] capitalize ${
                          inst.paidStatus === 'paid' ? 'bg-green-600 text-white' : 
                          inst.paidStatus === 'overdue' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                        }`}>{inst.paidStatus}</span>
                      </td>
                      <td className="px-2 py-1.5 border border-yellow-200">₹{inst.amountCollected?.toLocaleString() || '0'}</td>
                    </tr>
                  ))}
                  <tr className="bg-yellow-200 font-black">
                    <td colSpan={2} className="px-2 py-2 border border-yellow-300 text-right uppercase">Total</td>
                    <td className="px-2 py-2 border border-yellow-300">₹{totalInstallmentAmount.toLocaleString()}</td>
                    <td className="px-2 py-2 border border-yellow-300">₹{totalPrincipal.toLocaleString()}</td>
                    <td className="px-2 py-2 border border-yellow-300">₹{totalInterest.toLocaleString()}</td>
                    <td colSpan={3} className="px-2 py-2 border border-yellow-300"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Fee Details Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Processing Fee */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Processing Fee Details</p>
              <div className="bg-white border border-yellow-200 rounded-lg overflow-hidden">
                <table className="w-full text-[10px] border-collapse">
                  <tbody className="font-bold text-slate-700">
                    <tr className="border-b border-yellow-100">
                      <td className="px-3 py-2">Processing Fee</td>
                      <td className="px-3 py-2 text-right">₹268.78</td>
                    </tr>
                    <tr className="border-b border-yellow-100">
                      <td className="px-3 py-2">Service Tax @ 12%</td>
                      <td className="px-3 py-2 text-right">₹32.25</td>
                    </tr>
                    <tr className="border-b border-yellow-100">
                      <td className="px-3 py-2">Total Processing Fee</td>
                      <td className="px-3 py-2 text-right font-black text-slate-900">₹302.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insurance Fee */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Insurance Fee Details</p>
              <div className="bg-white border border-yellow-200 rounded-lg overflow-hidden">
                <table className="w-full text-[10px] border-collapse">
                  <thead>
                    <tr className="bg-slate-100 uppercase">
                      <th className="px-2 py-1 text-left border-b border-yellow-200">Name</th>
                      <th className="px-2 py-1 text-left border-b border-yellow-200">Nominee</th>
                      <th className="px-2 py-1 text-right border-b border-yellow-200">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-700">
                    <tr className="border-b border-yellow-100">
                      <td className="px-2 py-2">{loan?.customerName}</td>
                      <td className="px-2 py-2">{loan?.husbandName || 'N/A'}</td>
                      <td className="px-2 py-2 text-right">₹230.00</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-2 py-2 font-black">Total Premium Amount</td>
                      <td className="px-2 py-2 text-right font-black text-slate-900">₹510.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 4: Signatures & Footer */}
          <div className="pt-10 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-full border-b-2 border-slate-900 mb-2"></div>
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Authorized Signatory</p>
              <p className="text-[8px] text-slate-500 font-bold">For Matoshree Enterprise</p>
            </div>
            <div>
              <div className="w-full border-b-2 border-slate-900 mb-2"></div>
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Borrower Signature</p>
              <p className="text-[8px] text-slate-500 font-bold">I accept all terms & conditions</p>
            </div>
            <div>
              <div className="w-full border-b-2 border-slate-900 mb-2"></div>
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Witness Signature</p>
              <p className="text-[8px] text-slate-500 font-bold">Verified & Signed</p>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="bg-yellow-200 p-3 flex justify-center gap-8 text-[10px] font-black text-slate-700 uppercase tracking-widest">
          <span className="flex items-center gap-1"><PhoneCall size={12} /> General Queries: 1800 3010 2121</span>
          <span className="flex items-center gap-1"><PhoneCall size={12} /> Insurance Queries: 1800 3010 2122</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={() => alert('Downloading Comprehensive Loan Card PDF...')}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1"
        >
          <Download size={20} />
          DOWNLOAD LOAN CARD
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 font-black rounded-xl hover:bg-slate-50 transition-all shadow-xl hover:-translate-y-1"
        >
          <Printer size={20} />
          PRINT CARD
        </button>
      </div>
    </div>
  );
};

export default LoanReceiptCard;
