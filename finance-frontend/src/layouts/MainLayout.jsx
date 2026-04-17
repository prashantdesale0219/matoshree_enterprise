import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, User, LogOut, CreditCard, 
  Users, ShieldCheck, Menu, X, ChevronRight, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all duration-200 group ${
        isActive 
          ? 'bg-secondary text-primary font-bold shadow-lg shadow-secondary/20' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isActive ? 'text-primary' : 'group-hover:text-secondary transition-colors'} />
        <span className="text-sm tracking-wide">{item.name}</span>
      </div>
      {isActive && <ChevronRight size={16} className="text-primary" />}
    </Link>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [canApply, setCanApply] = useState(true);

  useEffect(() => {
    const checkEligibility = async () => {
      if (user?.role === 'admin') return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/loans/my-loans`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (data.success) {
          const activeLoan = data.data.find(l => l.status === 'approved' || l.status === 'pending');
          if (activeLoan) {
            if (activeLoan.status === 'pending' || activeLoan.pendingEMIs > 3) {
              setCanApply(false);
            }
          }
        }
      } catch (error) {
        console.error('Sidebar eligibility check failed:', error);
      }
    };
    if (user) checkEligibility();
  }, [user]);
  
  const userNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ...(canApply ? [{ name: 'Apply Loan', path: '/apply', icon: FileText }] : []),
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/users', icon: Users },
    { name: 'Loan Approvals', path: '/approvals', icon: CreditCard },
    { name: 'Active Loans', path: '/active-loans', icon: ShieldCheck },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-primary text-white z-50 transition-transform duration-300 transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-white/5 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-8">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-secondary/20">
              <CreditCard className="text-primary font-bold" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">
                FINANCE<span className="text-secondary">PRO</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Cosmic Edition</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Main Menu
          </div>
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path} 
              item={item} 
              isActive={location.pathname === item.path}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
            />
          ))}
        </nav>

        {/* User Profile / Logout Section */}
        <div className="p-6 bg-primary-dark/50 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center font-black text-secondary text-lg border border-secondary/20">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 font-bold text-sm"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-0 lg:left-72 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl lg:hidden hover:bg-slate-200 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="hidden md:block text-sm font-bold text-slate-400 uppercase tracking-widest">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Status: Active</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-8 mt-20 lg:ml-72 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
