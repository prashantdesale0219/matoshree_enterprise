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
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between mb-6">
      <div className={`p-4 rounded-xl ${color} shadow-sm transition-transform group-hover:scale-105 duration-300`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          trend === 'up' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
        }`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendValue}%
        </div>
      )}
    </div>
    <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">{title}</h3>
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
    } else if (type === 'Reject') {
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
          window.location.reload();
        }
      } catch (error) {
        alert('Rejection failed');
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

  const COLORS = ['#e11d48', '#000000', '#64748b'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-primary">
              Admin Hub
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} className="text-secondary" />
              Live System Status
            </span>
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            System <span className="text-secondary">Overview</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Hello, {user.name}! Here is what's happening today.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button 
            onClick={() => navigate('/users')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-primary font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Users size={18} className="text-primary" />
            User Base
          </button>
          <button 
            onClick={() => navigate('/apply')}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary-dark transition-all shadow-lg shadow-secondary/20 active:scale-95"
          >
            <CreditCard size={18} className="text-white" />
            New Application
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total Disbursed" 
          value={`₹${stats?.totalDisbursed?.toLocaleString() || '0'}`} 
          icon={DollarSign} 
          color="bg-primary" 
          loading={loading}
          trend="up"
          trendValue="12.5"
        />
        <div onClick={() => navigate('/active-loans')} className="cursor-pointer">
          <AdminStatCard 
            title="Active Loans" 
            value={stats?.activeLoans || '0'} 
            icon={TrendingUp} 
            color="bg-secondary" 
            loading={loading}
            trend="up"
            trendValue="8.2"
          />
        </div>
        <div onClick={() => navigate('/approvals')} className="cursor-pointer">
          <AdminStatCard 
            title="Pending Approvals" 
            value={stats?.pendingLoans || '0'} 
            icon={Clock} 
            color="bg-primary" 
            loading={loading}
          />
        </div>
        <div onClick={() => navigate('/users')} className="cursor-pointer">
          <AdminStatCard 
            title="Total Customers" 
            value={stats?.totalUsers || '0'} 
            icon={Users} 
            color="bg-primary" 
            loading={loading}
            trend="up"
            trendValue="15.4"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-primary tracking-tight">Disbursement Trend</h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Growth over the last 6 months</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#e11d48" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loan Distribution */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-primary tracking-tight">Status Mix</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Portfolio segmentation</p>
          </div>
          
          <div className="h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
              <span className="text-3xl font-black text-primary tracking-tight">
                {(stats?.activeLoans || 0) + (stats?.pendingLoans || 0)}
              </span>
            </div>
          </div>

          <div className="mt-auto space-y-4 pt-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Loans</span>
              </div>
              <span className="font-black text-primary text-sm">{stats?.activeLoans || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending</span>
              </div>
              <span className="font-black text-primary text-sm">{stats?.pendingLoans || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-3">
              <div className="p-2.5 bg-slate-50 text-primary rounded-xl">
                <Clock size={24} />
              </div>
              Pending Approvals
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Applications waiting for review</p>
          </div>
          <button 
            onClick={() => navigate('/approvals')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-2 group"
          >
            Review All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="p-8">
          {pendingLoans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pendingLoans.slice(0, 3).map((loan) => (
                <LoanCustomerCard 
                  key={loan._id} 
                  loan={loan} 
                  onAction={(id, type) => handleAction(id, type)}
                  adminMode={true}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">All caught up! No pending reviews.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
