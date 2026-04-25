import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, User, LogOut, CreditCard, 
  Users, ShieldCheck, Menu, X, ChevronRight, Bell, Moon, Sun
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const SidebarItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all duration-200 group ${
        isActive 
          ? 'bg-secondary text-white font-black shadow-lg shadow-secondary/10' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-secondary transition-colors'} />
        <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
      </div>
      {isActive && <ChevronRight size={14} className="text-white" />}
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
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    ...(canApply ? [{ name: 'Apply Loan', path: '/app/apply', icon: FileText }] : []),
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
    { name: 'My Profile', path: '/app/profile', icon: User },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/app/users', icon: Users },
    { name: 'Loan Approvals', path: '/app/approvals', icon: CreditCard },
    { name: 'Active Loans', path: '/app/active-loans', icon: ShieldCheck },
    { name: 'Notifications', path: '/app/notifications', icon: Bell },
    { name: 'My Profile', path: '/app/profile', icon: User },
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
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Matoshree" className="h-10 w-10 object-contain rounded-xl shadow-lg transition-transform group-hover:scale-110" />
            <span className="text-xl font-black text-white tracking-tighter">MATOSHREE</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Menu
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
        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="w-10 h-10 bg-secondary text-white rounded-lg flex items-center justify-center font-black text-lg overflow-hidden">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-white truncate">{user?.name}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-secondary/10 hover:text-secondary rounded-xl transition-all duration-200 font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} />
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
    <header className="h-16 bg-white border-b border-slate-100 fixed top-0 right-0 left-0 lg:left-72 z-30 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-400 lg:hidden hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h2 className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-secondary transition-all relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-secondary rounded-full border border-white"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-primary leading-none uppercase">{user?.name}</p>
            <p className="text-[9px] font-black text-secondary uppercase tracking-tighter mt-1">Verified</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xs text-primary overflow-hidden">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)
            )}
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
        <main className="flex-1 p-4 md:p-8 mt-16 lg:ml-72 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
