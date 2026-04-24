import { useState, useEffect } from 'react';
import { Search, UserPlus, UserX, CheckCircle, Loader2, ArrowRight, ShieldCheck, Mail, Smartphone, Filter, Bell, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Notification Modal State
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notifyData, setNotifyData] = useState({ title: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleNotify = (user) => {
    setSelectedUser(user);
    setShowNotifyModal(true);
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}` 
        },
        body: JSON.stringify({
          recipientId: selectedUser._id,
          title: notifyData.title,
          message: notifyData.message
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Notification sent to ${selectedUser.name}`);
        setShowNotifyModal(false);
        setNotifyData({ title: '', message: '' });
      }
    } catch (error) {
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser.token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}` 
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
      }
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || 
                         (statusFilter === 'Active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            User <span className="text-secondary">Management</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage access for all platform users.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-primary shadow-sm"
            />
          </div>
          
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all outline-none font-bold text-primary shadow-sm appearance-none cursor-pointer"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                <th className="px-8 py-6">User Identity</th>
                <th className="px-8 py-6 text-center">Platform Status</th>
                <th className="px-8 py-6 text-center">Access Role</th>
                <th className="px-8 py-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="4" className="px-8 py-6 h-20 bg-slate-50/30" />
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white group-hover:bg-secondary transition-all duration-300 shadow-lg shadow-primary/10 group-hover:shadow-secondary/20">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-primary text-sm tracking-tight">{user.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail size={12} className="text-slate-300" />
                            <p className="text-[11px] font-bold text-slate-400 lowercase">{user.email}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {user.role === 'admin' ? (
                          <ShieldCheck size={16} className="text-secondary" />
                        ) : (
                          <Smartphone size={16} className="text-primary" />
                        )}
                        <span className="text-[10px] font-black uppercase text-primary">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end items-center gap-3">
                        <button 
                          onClick={() => handleNotify(user)}
                          className="p-2.5 bg-slate-50 text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100"
                          title="Notify User"
                        >
                          <Bell size={18} />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`p-2.5 rounded-xl transition-all duration-300 border ${
                            user.isActive 
                              ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-600 hover:text-white' 
                              : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white'
                          }`}
                          title={user.isActive ? "Suspend Access" : "Grant Access"}
                        >
                          {user.isActive ? <UserX size={18} /> : <UserPlus size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotifyModal && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center">
                  <Send size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-primary dark:text-white tracking-tight">Send Notification</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">To: {selectedUser?.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNotifyModal(false)}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={sendNotification} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject / Title</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Loan Update"
                  value={notifyData.title}
                  onChange={(e) => setNotifyData({...notifyData, title: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-primary dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Content</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="Write your message here..."
                  value={notifyData.message}
                  onChange={(e) => setNotifyData({...notifyData, message: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-primary dark:text-white resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={sending}
                className="w-full py-5 bg-blue-500 text-white rounded-[1.5rem] font-black tracking-[0.2em] text-xs uppercase hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Send size={18} />
                    Send Alert Now
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
