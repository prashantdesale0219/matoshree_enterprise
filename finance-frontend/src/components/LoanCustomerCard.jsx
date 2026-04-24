import { Calendar, DollarSign, User, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoanCustomerCard = ({ loan, onAction, adminMode }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group relative">
      <div className="p-6 border-b border-slate-50 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xl rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden">
              {loan.customerImage ? (
                <img src={loan.customerImage} alt={loan.customerName} className="w-full h-full object-cover" />
              ) : (
                loan.customerName?.charAt(0)
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-primary tracking-tight truncate group-hover:text-secondary transition-colors">
              {loan.customerName}
            </h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">
              {loan.loanAccountNo || 'Verification Pending'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-6 relative">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
            <div className="flex items-center gap-1 text-primary font-black text-lg">
              <span className="text-secondary">₹</span>
              <span>{loan.loanAmount?.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</p>
            <div className="flex items-center gap-1 justify-end text-primary font-black text-sm uppercase tracking-tighter">
              <span>{loan.loanType}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold group/info">
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-primary/10 group-hover/info:text-primary transition-colors">
              <Phone size={14} />
            </div>
            <span>{loan.mobileNumber}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold group/info">
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-primary/10 group-hover/info:text-primary transition-colors">
              <Calendar size={14} />
            </div>
            <span>{new Date(loan.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {adminMode && loan.status === 'pending' ? (
          <div className="flex gap-2">
            <button 
              onClick={() => onAction(loan._id, 'Approve')}
              className="flex-1 py-3 bg-secondary text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-secondary-dark transition-all active:scale-95 shadow-lg shadow-secondary/10"
            >
              Approve
            </button>
            <button 
              onClick={() => onAction(loan._id, 'Reject')}
              className="flex-1 py-3 bg-primary text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
              Reject
            </button>
          </div>
        ) : (
          <button 
            onClick={() => navigate(`/loan/${loan._id}`)}
            className="w-full py-3.5 bg-slate-50 hover:bg-primary hover:text-white text-primary font-black rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 group/btn"
          >
            View Details
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LoanCustomerCard;
