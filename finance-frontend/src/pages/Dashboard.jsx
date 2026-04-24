import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Clock, CheckCircle2, Wallet, 
  PieChart as PieIcon, ArrowUpRight, Loader2, ArrowRight, 
  ShieldCheck, Zap, Bell, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import logo from '../assets/logo.png';

const StatCard = ({ title, value, icon: Icon, color, subValue, loading, trend }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white mb-6 shadow-sm rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
        <Icon size={24} />
      </div>
      <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{title}</h3>
      <div className="flex flex-col gap-1">
        {loading ? (
          <div className="h-8 w-32 bg-slate-50 animate-pulse rounded-lg" />
        ) : (
          <>
            <span className="text-3xl font-black text-primary tracking-tight">{value}</span>
            {subValue && (
              <span className="text-[11px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                {trend === 'up' && <ArrowUpRight size={14} className="text-secondary" />}
                {subValue}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/loans/my-loans`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (data.success) {
          setLoans(data.data);
        }
      } catch (error) {
        console.error('Error fetching user loans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoans();
  }, [user.token]);

  const activeLoan = loans.find(l => l.status === 'approved');
  const pendingLoan = loans.find(l => l.status === 'pending');
  const canApplyNewLoan = !pendingLoan && (!activeLoan || activeLoan.pendingEMIs <= 3);
  const totalLoanAmount = loans.reduce((sum, l) => sum + (l.loanAmount || 0), 0);

  const repaymentData = [
    { name: 'Paid', value: 0 },
    { name: 'Remaining', value: totalLoanAmount || 1000 },
  ];

  const COLORS = ['#e11d48', '#f1f5f9'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-slate-100 text-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-slate-200">
              Personal Hub
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} className="text-secondary" />
              Verified Account
            </span>
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            Financial <span className="text-secondary">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, {user.name}! Track your growth and applications.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {canApplyNewLoan ? (
            <button 
              onClick={() => navigate('/apply')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white rounded-[1.5rem] font-black tracking-widest text-xs uppercase hover:bg-secondary-dark transition-all shadow-xl shadow-secondary/20 active:scale-95 group"
            >
              <Zap size={18} className="text-white" />
              Apply New Loan
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex flex-col items-end gap-1">
              <div className="px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 cursor-not-allowed flex items-center gap-2">
                <Clock size={14} />
                New Loan Restricted
              </div>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-tighter pr-2">
                {pendingLoan 
                  ? 'Your current application is under review' 
                  : `Pay ${activeLoan.pendingEMIs - 3} more EMIs to apply again`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard 
          title="Portfolio Status" 
          value={loans.length > 0 ? (activeLoan ? 'Active' : 'Pending') : 'No Loans'} 
          icon={CheckCircle2} 
          color={activeLoan ? "bg-secondary" : "bg-primary"} 
          subValue={activeLoan ? "Regular Repayment" : "Application Under Review"}
          loading={loading}
          trend={activeLoan ? 'up' : null}
        />
        <StatCard 
          title="Total Indebtedness" 
          value={`₹${totalLoanAmount.toLocaleString()}`} 
          icon={Wallet} 
          color="bg-primary" 
          subValue={`${loans.length} Application(s) filed`}
          loading={loading}
        />
        <StatCard 
          title="Repayment Clock" 
          value={activeLoan ? "Live" : "N/A"} 
          icon={Clock} 
          color="bg-primary" 
          subValue={activeLoan ? "Next EMI tracking active" : "No active repayment"}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Repayment Progress Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight flex items-center gap-2">
                <PieIcon size={24} className="text-secondary" />
                Repayment Journey
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Principal & Interest analytics</p>
            </div>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={repaymentData}
                  innerRadius={90}
                  outerRadius={110}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {repaymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-black text-primary">0%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Cleared</span>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-xs font-bold text-slate-500">Paid: ₹0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-100 rounded-full" />
              <span className="text-xs font-bold text-slate-500">Pending: ₹{totalLoanAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action & Info Card */}
        <div className="space-y-6">
          <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
                <TrendingUp size={24} className="text-secondary" />
                Next Steps
              </h3>
              <div className="space-y-4">
                {loans.length > 0 ? (
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">
                      You have <span className="text-secondary font-black">{loans.filter(l => l.status === 'pending').length}</span> pending applications.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={12} />
                      Updates in 24-48 hours
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">
                      Start your journey by applying for a loan with Matoshree Enterprise.
                    </p>
                    <button 
                      onClick={() => navigate('/apply')}
                      className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-2 group/btn"
                    >
                      Apply Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 pt-10">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="p-2 bg-secondary rounded-lg text-white">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Note</p>
                  <p className="text-xs font-bold">Check notifications for EMI alerts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Table Section */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 text-primary rounded-xl">
                <Calendar size={24} />
              </div>
              Loan Accounts
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Full history of your applications</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                <th className="px-8 py-5">Application Type</th>
                <th className="px-8 py-5 text-center">Amount</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Filed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <tr 
                    key={loan._id} 
                    onClick={() => navigate(`/loan/${loan._id}`)}
                    className="hover:bg-slate-50/50 transition-all duration-300 cursor-pointer group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {loan.loanType?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-primary text-sm tracking-tight">{loan.loanType}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Account Active</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <p className="font-black text-primary tracking-tight">₹{loan.loanAmount.toLocaleString()}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{loan.tenureMonths} Months Tenure</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          loan.status === 'approved' 
                            ? 'bg-secondary/5 text-secondary border-secondary/20' 
                            : loan.status === 'pending'
                            ? 'bg-primary/5 text-primary border-primary/20'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="font-black text-primary text-sm tracking-tight">
                        {new Date(loan.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Application Date</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                        <Calendar size={32} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">No Loan Applications Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
