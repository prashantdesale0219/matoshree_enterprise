import { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Bell, CreditCard, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useAuth(); // We'll use login to update the local user state after profile update
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    password: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Update local user data in AuthContext/LocalStorage
        const updatedUser = { ...user, ...data };
        localStorage.setItem('finance_user', JSON.stringify(updatedUser));
        window.location.reload(); // Simple way to refresh state
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      setError('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-accent/10 text-accent-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-accent/10">
              Account
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Shield size={12} className="text-green-500" />
              Secure Profile
            </span>
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            My <span className="text-accent">Profile</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your personal information and security settings.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-600 font-bold animate-in zoom-in duration-300">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold animate-in zoom-in duration-300">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic p-8 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-accent opacity-20"></div>
            <div className={`w-28 h-28 ${user?.role === 'admin' ? 'bg-accent shadow-accent/20' : 'bg-primary shadow-primary/20'} rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-white text-4xl font-black shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-primary tracking-tight mb-1">{user?.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className={`px-3 py-1 ${user?.role === 'admin' ? 'bg-accent/10 text-accent-dark border-accent/10' : 'bg-primary/10 text-primary-dark border-primary/10'} text-[10px] font-black uppercase tracking-[0.2em] rounded-full border`}>
                {user?.role}
              </span>
              {user?.role === 'admin' && (
                <span className="flex items-center gap-1 text-[9px] font-black text-green-500 uppercase tracking-widest">
                  <Shield size={10} /> Verified Admin
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-4 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary-light transition-all shadow-lg shadow-primary/10 active:scale-95"
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member since Jan 2024</p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Settings */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-lg font-black text-primary tracking-tight">Personal Information</h3>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="text" 
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="tel" 
                      disabled={!isEditing}
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={18} />
                    <input 
                      type="email" 
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary disabled:opacity-50"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-2 md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password (Optional)</label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={18} />
                      <input 
                        type="password" 
                        placeholder="Leave blank to keep current password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-accent text-white rounded-[1.5rem] font-black tracking-[0.2em] text-xs uppercase hover:bg-accent-dark transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <CheckCircle2 size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-cosmic overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-lg font-black text-primary tracking-tight">Security & Activity</h3>
            </div>
            <div className="divide-y divide-slate-50">
              <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                    <Bell size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary uppercase tracking-tight">Notifications</p>
                    <p className="text-xs text-slate-500 font-medium">Receive alerts about your loan status</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
