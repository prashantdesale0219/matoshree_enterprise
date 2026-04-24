import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle, Calendar, Trash2 } from 'lucide-react';
import LoanReceiptCard from '../components/LoanReceiptCard';

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/loans/${id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.success) {
          setLoanData(data.data);
        } else {
          setError(data.message || 'Failed to fetch loan details');
        }
      } catch (err) {
        setError('Server error while fetching loan details');
      } finally {
        setLoading(false);
      }
    };

    if (id && user?.token) {
      fetchLoanDetails();
    }
  }, [id, user?.token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-slate-500 font-bold animate-pulse">Loading Loan Details...</p>
      </div>
    );
  }

  if (error || !loanData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 inline-block">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Details</h2>
          <p className="text-slate-600 mb-6">{error || 'Loan not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 mx-auto hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const { loan, installments } = loanData;
  const nextInstallment = installments.find(i => i.paidStatus === 'pending');
  const totalPaid = installments.filter(i => i.paidStatus === 'paid').length;

  const handleBreakLoan = async () => {
    if (!window.confirm('WARNING: Are you sure you want to BREAK/CLOSE this loan? All pending installments will be cancelled. This action cannot be undone.')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/loans/${id}/break`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${user.token}` 
        }
      });
      const data = await res.json();
      if (data.success) {
        alert('Loan broken and closed successfully!');
        window.location.reload();
      } else {
        alert(data.message || 'Failed to break loan');
      }
    } catch (err) {
      alert('Server error while breaking loan');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Loan Details</h1>
            <p className="text-slate-500 font-medium">Account: {loan.loanAccountNo || 'Pending'}</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {user?.role === 'admin' && loan.status === 'approved' && (
            <button 
              onClick={handleBreakLoan}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-200"
            >
              <Trash2 size={14} /> Break Loan
            </button>
          )}
          <span className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider shadow-sm flex items-center gap-2 ${
            loan.status === 'approved' ? 'bg-green-100 text-green-700' : 
            loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
            loan.status === 'closed' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
          }`}>
            {(loan.status === 'approved' || loan.status === 'closed') && <CheckCircle2 size={16} />}
            Loan {loan.status}
          </span>
          {loan.approvedAt && (
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Approved on: {new Date(loan.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LoanReceiptCard data={loanData} />
        </div>
        
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Outstanding</h3>
                <p className="text-4xl font-black text-white">₹{installments.reduce((sum, i) => i.paidStatus !== 'paid' ? sum + i.installmentAmount : sum, 0).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Next Due Date</p>
                  <p className="text-sm font-bold">{nextInstallment ? new Date(nextInstallment.repaymentDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Progress</p>
                  <p className="text-sm font-bold">{totalPaid} / {installments.length} Paid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-500" /> Notifications
            </h3>
            <div className="space-y-4">
              {nextInstallment ? (
                <div className="flex gap-3 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-xs text-blue-900 font-medium leading-relaxed">
                    Your next EMI of ₹{nextInstallment.installmentAmount.toLocaleString()} is due on {new Date(nextInstallment.repaymentDate).toLocaleDateString()}.
                  </p>
                </div>
              ) : (
                <div className="flex gap-3 p-3 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-xs text-green-900 font-medium leading-relaxed">
                    All installments are paid! Your loan account is successfully closed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;
