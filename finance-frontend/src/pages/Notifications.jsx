import { useState, useEffect } from 'react';
import { Bell, Mail, Clock, CheckCircle2, AlertCircle, Trash2, Send, User, Loader2, X, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [user.token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
    if (!notification.isRead && notification.recipient?._id === user.id) {
      markAsRead(notification._id);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-accent/10 text-accent-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-accent/10">
              Updates
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Bell size={12} className="text-accent" />
              Live Alerts
            </span>
          </div>
          <h1 className="text-4xl font-black text-primary dark:text-white tracking-tight">
            Notifications <span className="text-accent">Center</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Stay updated with your loan status and important announcements.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-accent" size={48} />
          <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Fetching your alerts...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-cosmic p-16 text-center space-y-6">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
            <Bell size={40} />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary dark:text-white">All Caught Up!</h3>
            <p className="text-slate-500 font-medium mt-1">You don't have any new notifications at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              onClick={() => handleViewDetails(notification)}
              className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer group hover:scale-[1.01] active:scale-[0.99] ${
                notification.isRead 
                  ? 'border-slate-100 dark:border-slate-800 opacity-75' 
                  : 'border-accent/20 shadow-lg shadow-accent/5 ring-1 ring-accent/5'
              }`}
            >
              <div className="flex items-start gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                  notification.type === 'loan' ? 'bg-blue-50 text-blue-500' :
                  notification.type === 'payment' ? 'bg-green-50 text-green-500' :
                  'bg-accent/10 text-accent'
                }`}>
                  {notification.type === 'loan' ? <CreditCard size={24} /> :
                   notification.type === 'payment' ? <CheckCircle2 size={24} /> :
                   <Send size={24} />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <h4 className={`font-black tracking-tight ${notification.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-primary dark:text-white text-lg'}`}>
                        {notification.title}
                      </h4>
                      {notification.sender?._id === user.id && (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-slate-200 dark:border-slate-700">
                          Sent
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <User size={10} /> 
                      {notification.sender?._id === user.id 
                        ? `To: ${notification.recipient?.name || 'User'}`
                        : `From: ${notification.sender?.name || 'Admin'}`}
                    </span>
                    {!notification.isRead && notification.recipient?._id === user.id && (
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  selectedNotification.type === 'loan' ? 'bg-blue-50 text-blue-500' :
                  selectedNotification.type === 'payment' ? 'bg-green-50 text-green-500' :
                  'bg-accent/10 text-accent'
                }`}>
                  {selectedNotification.type === 'loan' ? <CreditCard size={28} /> :
                   selectedNotification.type === 'payment' ? <CheckCircle2 size={28} /> :
                   <Send size={28} />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-primary dark:text-white tracking-tight leading-tight">Notification Details</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(selectedNotification.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</p>
                <h4 className="text-2xl font-black text-primary dark:text-white tracking-tight">
                  {selectedNotification.title}
                </h4>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/50">
                  <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap text-lg">
                    {selectedNotification.message}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-50 dark:border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">From</p>
                  <p className="text-sm font-bold text-primary dark:text-white flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    {selectedNotification.sender?.name || 'System'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-50 dark:border-slate-800/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recipient</p>
                  <p className="text-sm font-bold text-primary dark:text-white flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    {selectedNotification.recipient?.name || 'User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-50 dark:border-slate-800">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-full py-5 bg-primary dark:bg-slate-800 text-white rounded-[1.5rem] font-black tracking-[0.2em] text-xs uppercase hover:opacity-90 transition-all shadow-xl active:scale-95"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
