import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, CheckCircle2, XCircle, Eye, FileText, Calendar, Wallet, Loader2, User, MapPin, Smartphone, CreditCard, Landmark } from 'lucide-react';

const LoanApprovals = ({ status = 'pending' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [approvalData, setApprovalData] = useState({
    loanAccountNo: '',
    disbursementDate: new Date().toISOString().split('T')[0],
    centreGroupNos: '',
    lendingType: 'Group Lending',
    interestRate: 23.60,
    durationMonths: 24
  });

  useEffect(() => {
    fetchLoans();
  }, [user.token, status]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/loans?status=${status}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLoans(data.data);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (loan, action) => {
    setSelectedLoan(loan);
    if (action === 'Approve') {
      setApprovalData(prev => ({
        ...prev,
        centreGroupNos: loan.centreGroupNos || '',
        loanAccountNo: `L-${Math.floor(1000000000 + Math.random() * 9000000000)}`
      }));
      setShowApprovalModal(true);
    } else if (action === 'View') {
      setShowViewModal(true);
    } else if (action === 'Reject') {
      confirmRejection(loan._id);
    } else {
      alert(`Loan ${loan._id} ${action} action triggered!`);
    }
  };

  const confirmRejection = async (id) => {
    if (!window.confirm('Are you sure you want to reject this loan application?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/loans/${id}/reject`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${user.token}` 
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Loan Rejected Successfully!');
        setLoans(prev => prev.filter(l => l._id !== id));
        setShowViewModal(false);
      } else {
        alert(data.message || 'Rejection failed');
      }
    } catch (error) {
      alert('Server error during rejection');
    }
  };

  const confirmApproval = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/loans/${selectedLoan._id}/approve`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(approvalData)
      });
      const data = await res.json();
      if (data.success) {
        alert(`Loan Approved Successfully! Installments generated.`);
        setLoans(prev => prev.filter(l => l._id !== selectedLoan._id));
        setShowApprovalModal(false);
      } else {
        alert(data.message || 'Approval failed');
      }
    } catch (error) {
      alert('Server error during approval');
    }
  };

  const filteredLoans = loans.filter(loan => 
    (loan.customerName || loan.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (loan._id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-primary">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            {status === 'pending' ? 'Pending' : 'Approved'} <span className="text-secondary">Loans</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage loan applications in real-time.</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search customer or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-[1.25rem] focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-primary shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100" />
          ))
        ) : filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <div key={loan._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-cosmic hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
                    {loan.customerImage ? (
                      <img src={loan.customerImage} alt={loan.customerName} className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                    <p className="text-xl font-black text-primary tracking-tight">₹{loan.loanAmount?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-black text-primary tracking-tight leading-tight mb-1 truncate">{loan.customerName || loan.userId?.name}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} />
                    Filed {new Date(loan.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-6 border-t border-slate-50">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(loan, 'View')}
                      className="flex-1 py-3 bg-slate-50 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={14} /> View
                    </button>
                    {status === 'pending' && (
                      <button 
                        onClick={() => handleAction(loan, 'Reject')}
                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    )}
                  </div>
                  {status === 'pending' ? (
                    <button 
                      onClick={() => handleAction(loan, 'Approve')}
                      className="w-full py-3 bg-secondary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/10 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={14} /> Approve Application
                    </button>
                  ) : (
                    <div className="w-full py-3 bg-green-50 text-green-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                      <CheckCircle2 size={14} /> Active Loan
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-400 font-bold">No {status} loan applications found.</p>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {showViewModal && selectedLoan && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            <div className="bg-slate-900 p-6 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                <FileText className="text-primary" /> Application Details
              </h2>
              <button onClick={() => setShowViewModal(false)} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                <XCircle />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-50">
                <div className="w-32 h-32 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl rotate-3 mb-4 overflow-hidden">
                  {selectedLoan.customerImage ? (
                    <img src={selectedLoan.customerImage} alt={selectedLoan.customerName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={64} />
                  )}
                </div>
                <h3 className="text-2xl font-black text-primary tracking-tight">{selectedLoan.customerName}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Application ID: {selectedLoan._id}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <User size={16} className="text-primary" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Customer Name" value={selectedLoan.customerName} icon={User} />
                    <DetailItem label="Husband's Name" value={selectedLoan.husbandName} icon={User} />
                    <DetailItem label="Father's Name" value={selectedLoan.fatherName} icon={User} />
                    <DetailItem label="Co-applicant" value={selectedLoan.coApplicantName} icon={User} />
                    <DetailItem label="Mobile Number" value={selectedLoan.mobileNumber} icon={Smartphone} />
                    <DetailItem label="Nominee Mobile" value={selectedLoan.nomineeMobileNumber} icon={Smartphone} />
                  </div>
                </div>

                {/* Address & Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" /> Address & Location
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Permanent Address" value={selectedLoan.address} icon={MapPin} />
                    <DetailItem label="Live Location" value={selectedLoan.liveLocation} icon={MapPin} />
                  </div>
                </div>

                {/* Loan Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" /> Loan Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Loan Amount" value={`₹${selectedLoan.loanAmount?.toLocaleString()}`} icon={Wallet} />
                    <DetailItem label="Loan Type" value={selectedLoan.loanType} icon={CreditCard} />
                    <DetailItem label="Purpose" value={selectedLoan.purpose} icon={FileText} />
                    <DetailItem label="Repayment Frequency" value={selectedLoan.repaymentFrequency} icon={Calendar} />
                    <DetailItem label="Preferred Day" value={selectedLoan.repaymentDay} icon={Calendar} />
                  </div>
                </div>

                {/* Bank Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <Landmark size={16} className="text-primary" /> Bank Details
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <DetailItem label="Bank Name" value={selectedLoan.bankName} icon={Landmark} />
                    <DetailItem label="Account Number" value={selectedLoan.bankAccountNo} icon={Landmark} />
                    <DetailItem label="Centre/Group Nos" value={selectedLoan.centreGroupNos} icon={Landmark} />
                  </div>
                </div>
              </div>

              {/* Action Buttons inside View Modal */}
              <div className="mt-12 flex gap-4 border-t pt-8">
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleAction(selectedLoan, 'Approve');
                  }}
                  className="flex-1 py-4 bg-primary text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-primary-dark shadow-xl shadow-yellow-100 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} /> Approve Application
                </button>
                <button 
                  onClick={() => confirmRejection(selectedLoan._id)}
                  className="flex-1 py-4 bg-red-50 text-red-600 font-black uppercase tracking-widest rounded-2xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={20} /> Reject Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-primary p-6 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 /> Approve Loan: {selectedLoan?.customerName || selectedLoan?.userId?.name}
              </h2>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-900 hover:bg-white/20 p-2 rounded-full transition-colors">
                <XCircle />
              </button>
            </div>
            <form className="p-8 space-y-6" onSubmit={confirmApproval}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Loan Account Number</label>
                  <input 
                    required 
                    type="text" 
                    value={approvalData.loanAccountNo}
                    onChange={(e) => setApprovalData({...approvalData, loanAccountNo: e.target.value})}
                    placeholder="e.g. 443073600003435" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Disbursement Date</label>
                  <input 
                    required 
                    type="date" 
                    value={approvalData.disbursementDate}
                    onChange={(e) => setApprovalData({...approvalData, disbursementDate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Centre & Group Nos</label>
                  <input 
                    required 
                    type="text" 
                    value={approvalData.centreGroupNos}
                    onChange={(e) => setApprovalData({...approvalData, centreGroupNos: e.target.value})}
                    placeholder="e.g. 0827 / 02" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Lending Type / Cycle</label>
                  <select 
                    value={approvalData.lendingType}
                    onChange={(e) => setApprovalData({...approvalData, lendingType: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900"
                  >
                    <option>Group Lending</option>
                    <option>Individual Lending</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={approvalData.interestRate}
                    onChange={(e) => setApprovalData({...approvalData, interestRate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Loan Tenure (Months)</label>
                  <input 
                    type="number" 
                    value={approvalData.durationMonths}
                    onChange={(e) => setApprovalData({...approvalData, durationMonths: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold text-slate-900" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowApprovalModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-4 bg-primary text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:bg-primary-dark shadow-xl shadow-yellow-100 transition-all hover:-translate-y-1">
                  Approve & Finalize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanApprovals;
