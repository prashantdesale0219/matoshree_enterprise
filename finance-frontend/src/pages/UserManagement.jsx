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
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-accent/10 text-accent-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-accent/10">
              Administration
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} className="text-green-500" />
              Secure Access
            </span>
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            User <span className="text-accent">Management</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and control access for all registered system users.</p>
        </div>
        <button 
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black tracking-widest text-xs uppercase hover:bg-primary-light transition-all shadow-xl shadow-primary/20 active:scale-95 group"
        >
          <UserPlus size={18} className="text-secondary" />
          Add New Member
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-cosmic flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-accent transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            <Filter size={14} />
            Filter By
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary appearance-none cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="animate-spin text-accent" size={48} />
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Syncing User Database...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                  <th className="px-8 py-6">Member Identity</th>
                  <th className="px-8 py-6">Contact Info</th>
                  <th className="px-8 py-6">System Role</th>
                  <th className="px-8 py-6 text-center">Current Status</th>
                  <th className="px-8 py-6 text-right">Administrative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-secondary flex items-center justify-center font-black text-lg border-4 border-white shadow-lg group-hover:rotate-6 transition-transform duration-300">
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-primary text-sm tracking-tight">{user.name}</p>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {user._id?.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Mail size={14} className="text-slate-300" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Smartphone size={14} className="text-slate-300" />
                            {user.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'admin' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                          user.isActive 
                            ? 'bg-green-50 text-green-600 border border-green-100' 
                            : 'bg-red-50 text-red-500 border border-red-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-600 animate-pulse' : 'bg-red-500'}`} />
                          {user.isActive ? 'Active' : 'Restricted'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleNotify(user)}
                            className="p-4 rounded-2xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm shadow-blue-100"
                            title="Send Notification"
                          >
                            <Bell size={20} />
                          </button>
                          <button 
                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                            className={`p-4 rounded-2xl transition-all duration-300 active:scale-90 ${
                              user.isActive 
                                ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm shadow-red-100' 
                                : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white shadow-sm shadow-green-100'
                            }`} 
                            title={user.isActive ? "Restrict Access" : "Grant Access"}
                          >
                            {user.isActive ? <UserX size={20} /> : <CheckCircle size={20} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                          <Search size={32} />
                        </div>
                        <p className="text-slate-400 font-black text-sm uppercase tracking-widest">No matching members found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
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
