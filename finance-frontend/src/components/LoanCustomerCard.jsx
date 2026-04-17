import { Calendar, DollarSign, User, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoanCustomerCard = ({ loan }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden hover:shadow-2xl transition-all duration-500 group relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700" />
      
      <div className="p-6 border-b border-slate-50 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              {loan.customerName?.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg border-2 border-white flex items-center justify-center text-white shadow-sm">
              <ShieldCheck size={12} fill="currentColor" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-black text-primary tracking-tight truncate group-hover:text-accent transition-colors">
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
              <span className="text-accent">₹</span>
              <span>{loan.loanAmount?.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next EMI</p>
            <div className="flex items-center gap-1 justify-end text-secondary-dark font-black text-lg">
              <span>₹{loan.nextEMI?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold group/info">
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-accent/10 group-hover/info:text-accent transition-colors">
              <Phone size={14} />
            </div>
            <span>{loan.mobileNumber}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold group/info">
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-accent/10 group-hover/info:text-accent transition-colors">
              <MapPin size={14} />
            </div>
            <span className="truncate">{loan.address}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-bold group/info">
            <div className="p-1.5 bg-slate-50 rounded-lg group-hover/info:bg-accent/10 group-hover/info:text-accent transition-colors">
              <Calendar size={14} />
            </div>
            <span>Next: {loan.nextEMIDate ? new Date(loan.nextEMIDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate(`/loan/${loan._id}`)}
          className="w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-primary font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 group/btn shadow-sm hover:shadow-xl hover:shadow-primary/20 active:scale-95"
        >
          View Portfolio
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default LoanCustomerCard;
