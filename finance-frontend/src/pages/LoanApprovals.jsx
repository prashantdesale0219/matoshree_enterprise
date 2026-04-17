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
    } else {
      alert(`Loan ${loan._id} ${action} action triggered!`);
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
        <p className="text-sm font-bold text-slate-900">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 capitalize">
            {status === 'pending' ? 'Loan Approvals' : 'Active Loan Customers'}
          </h1>
          <p className="text-slate-500">
            {status === 'pending' 
              ? 'Review and approve pending loan applications.' 
              : 'View and manage all active loan accounts.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Pending Review</p>
            <p className="text-xl font-bold text-slate-900">{loans.length} Loans</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <Wallet size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Amount Pending</p>
            <p className="text-xl font-bold text-slate-900">₹{loans.reduce((sum, l) => sum + (l.loanAmount || 0), 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">System Status</p>
            <p className="text-xl font-bold text-slate-900">Operational</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-primary" size={40} />
              <p className="text-slate-500 font-medium">Fetching pending applications...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Loan Details</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <tr key={loan._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{loan.customerName || loan.userId?.name}</p>
                          <p className="text-xs text-slate-500">{loan.userId?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900">₹{loan.loanAmount?.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">{loan.loanType}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-[150px]">{loan.purpose}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{new Date(loan.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button 
                          onClick={() => status === 'approved' ? navigate(`/loan/${loan._id}`) : handleAction(loan, 'View')}
                          className={`p-2 rounded-lg transition-colors ${
                            status === 'approved' ? 'bg-accent/10 text-accent hover:bg-accent/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                          title={status === 'approved' ? "View Portfolio" : "View Documents"}
                        >
                          {status === 'approved' ? <FileText size={18} /> : <Eye size={18} />}
                        </button>
                        
                        {status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleAction(loan, 'Approve')}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" 
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleAction(loan, 'Reject')}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" 
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No matching applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
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
                  onClick={() => {
                    alert('Rejecting application...');
                    setShowViewModal(false);
                  }}
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
