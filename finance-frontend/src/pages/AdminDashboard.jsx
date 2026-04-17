import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, CreditCard, Clock, XCircle, TrendingUp, CheckCircle2, 
  DollarSign, BarChart3, Loader2, ArrowRight, LayoutDashboard,
  ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import LoanCustomerCard from '../components/LoanCustomerCard';

const AdminStatCard = ({ title, value, icon: Icon, color, loading, trend, trendValue }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-cosmic hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-2xl ${color} shadow-lg transition-transform group-hover:scale-110 duration-300`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendValue}%
        </div>
      )}
    </div>
    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{title}</h3>
    {loading ? (
      <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg" />
    ) : (
      <p className="text-3xl font-black text-primary tracking-tight">{value}</p>
    )}
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, pendingRes, activeRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/loans?status=pending`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/admin/active-loans`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          })
        ]);

        const statsData = await statsRes.json();
        const pendingData = await pendingRes.json();
        const activeData = await activeRes.json();

        if (statsData.success) setStats(statsData.data);
        if (pendingData.success) setPendingLoans(pendingData.data);
        if (activeData.success) setActiveLoans(activeData.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user.token]);

  const handleAction = async (id, type) => {
    if (type === 'Approve') {
      const disbursementDate = new Date().toISOString();
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/loans/${id}/approve`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` 
          },
          body: JSON.stringify({
            loanAccountNo: `L-${Math.floor(1000 + Math.random() * 9000)}`,
            disbursementDate,
            interestRate: 23.60,
            durationMonths: 24
          })
        });
        const data = await res.json();
        if (data.success) {
          alert('Loan Approved Successfully!');
          window.location.reload();
        }
      } catch (error) {
        alert('Approval failed');
      }
    } else {
      alert(`${type} action triggered for ${id}`);
    }
  };

  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: stats?.activeLoans * 5000 || 2390 },
  ];

  const pieData = [
    { name: 'Active', value: stats?.activeLoans || 0 },
    { name: 'Pending', value: stats?.pendingLoans || 0 },
    { name: 'Users', value: stats?.totalUsers || 0 }
  ];

  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-secondary/20 text-secondary-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-secondary/20">
              Overview
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live Updates
            </span>
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            Cosmic <span className="text-secondary-dark">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Hello, {user.name}! Here is what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button 
            onClick={() => navigate('/users')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-primary font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
          >
            <Users size={18} className="text-accent" />
            User List
          </button>
          <button 
            onClick={() => navigate('/apply')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-light transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            <CreditCard size={18} className="text-secondary" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => navigate('/users')} className="cursor-pointer">
          <AdminStatCard 
            title="Registered Users" 
            value={stats?.totalUsers || 0} 
            icon={Users} 
            color="bg-accent" 
            loading={loading}
            trend="up"
            trendValue="12"
          />
        </div>
        <div onClick={() => navigate('/active-loans')} className="cursor-pointer">
          <AdminStatCard 
            title="Active Portfolio" 
            value={stats?.activeLoans || 0} 
            icon={CheckCircle2} 
            color="bg-green-500" 
            loading={loading}
            trend="up"
            trendValue="8"
          />
        </div>
        <div onClick={() => navigate('/approvals')} className="cursor-pointer">
          <AdminStatCard 
            title="Pending Review" 
            value={stats?.pendingLoans || 0} 
            icon={Clock} 
            color="bg-secondary-dark" 
            loading={loading}
            trend="down"
            trendValue="3"
          />
        </div>
        <AdminStatCard 
          title="Total Collected" 
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} 
          icon={DollarSign} 
          color="bg-primary" 
          loading={loading}
          trend="up"
          trendValue="24"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Loan Growth Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-primary tracking-tight flex items-center gap-2">
                <TrendingUp size={24} className="text-accent" />
                Revenue Performance
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Monthly collection analytics</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-500 px-4 py-2 focus:ring-2 focus:ring-accent/20 outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                />
                <Tooltip 
                  cursor={{stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5'}}
                  contentStyle={{
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    padding: '15px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Distribution */}
        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-accent/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-8">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <BarChart3 size={24} className="text-secondary" />
                Portfolio Mix
              </h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Loan status distribution</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={75}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '15px', border: 'none', color: '#000'}}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{stats?.activeLoans || 0}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-8">
              {pieData.map((item, i) => (
                <div key={item.name} className="text-center p-3 bg-white/5 rounded-2xl border border-white/5">
                  <div className={`w-2 h-2 rounded-full mx-auto mb-2`} style={{backgroundColor: COLORS[i]}} />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{item.name}</p>
                  <p className="text-sm font-black mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                <Clock size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-primary tracking-tight">Pending Reviews</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting verification</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/approvals')}
              className="px-5 py-2.5 bg-slate-50 text-primary font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                  <th className="px-8 py-5">Customer Profile</th>
                  <th className="px-8 py-5">Loan Details</th>
                  <th className="px-8 py-5">Application Date</th>
                  <th className="px-8 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-20"><Loader2 className="animate-spin mx-auto text-accent" size={40} /></td></tr>
                ) : pendingLoans.length > 0 ? (
                  pendingLoans.map((loan) => (
                    <tr key={loan._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-500 text-lg border border-white shadow-sm group-hover:bg-accent group-hover:text-white transition-all duration-300">
                            {loan.customerName?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-primary text-sm tracking-tight">{loan.customerName}</div>
                            <div className="text-[11px] font-bold text-slate-400 mt-0.5">{loan.mobileNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-black text-primary text-sm">₹{loan.loanAmount?.toLocaleString()}</div>
                        <div className="text-[11px] font-bold text-accent uppercase tracking-widest mt-0.5">{loan.loanType}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold text-slate-600">{new Date(loan.createdAt).toLocaleDateString()}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Submitted</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => handleAction(loan._id, 'Approve')}
                            className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm shadow-green-100 active:scale-90"
                            title="Approve"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction(loan._id, 'Reject')}
                            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm shadow-red-100 active:scale-90"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                          <CheckCircle2 size={32} />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">All caught up! No pending applications.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Cards */}
        <div className="space-y-6">
          <div className="bg-accent rounded-[2.5rem] p-8 text-white shadow-xl shadow-accent/20 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
                <LayoutDashboard size={24} className="text-secondary" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/users')}
                  className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-[1.25rem] transition-all duration-300 border border-white/10 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 text-sm font-black tracking-tight">
                    <Users size={20} className="text-secondary" />
                    Manage Users
                  </div>
                  <ArrowRight size={16} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                </button>
                <button 
                  onClick={() => navigate('/apply')}
                  className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-[1.25rem] transition-all duration-300 border border-white/10 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 text-sm font-black tracking-tight">
                    <CreditCard size={20} className="text-secondary" />
                    Loan Application
                  </div>
                  <ArrowRight size={16} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                </button>
                <button 
                  className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-[1.25rem] transition-all duration-300 border border-white/10 group/btn active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 text-sm font-black tracking-tight">
                    <Wallet size={20} className="text-secondary" />
                    Reports
                  </div>
                  <ArrowRight size={16} className="opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-cosmic flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-secondary/20 rounded-[2rem] flex items-center justify-center text-secondary-dark mb-4 border-4 border-white shadow-xl rotate-6">
              <ShieldCheck size={40} />
            </div>
            <h4 className="text-lg font-black text-primary tracking-tight">System Secure</h4>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">SSL Encrypted</p>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-6 mb-2 overflow-hidden">
              <div className="w-full h-full bg-green-500 rounded-full" />
            </div>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Operational</span>
          </div>
        </div>
      </div>

      {/* Active Loan Customers Cards Section */}
      <div className="space-y-8 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
          <div>
            <h2 className="text-3xl font-black text-primary tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-green-50 text-green-500 rounded-2xl">
                <CheckCircle2 size={28} />
              </div>
              Active Accounts
            </h2>
            <p className="text-slate-500 font-medium mt-1">Currently managing {activeLoans.length} loan accounts</p>
          </div>
          <button 
            onClick={() => navigate('/active-loans')}
            className="group flex items-center gap-2 px-6 py-3 bg-white text-primary font-black text-sm rounded-2xl border border-slate-200 hover:border-accent transition-all hover:shadow-lg hover:shadow-accent/5"
          >
            View Full List
            <ArrowRight size={18} className="text-slate-300 group-hover:text-accent group-hover:translate-x-1 transition-all" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic animate-pulse" />
            ))
          ) : activeLoans.length > 0 ? (
            activeLoans.slice(0, 8).map(loan => (
              <LoanCustomerCard key={loan._id} loan={loan} />
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                <CreditCard size={40} />
              </div>
              <p className="text-slate-400 font-black text-lg tracking-tight">No active loan accounts found</p>
              <p className="text-slate-300 text-sm font-bold uppercase tracking-widest mt-1">Start by approving applications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
