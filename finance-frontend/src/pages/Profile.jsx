import { User, Mail, Phone, MapPin, Shield, Bell, CreditCard } from 'lucide-react';

const Profile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: '123, Financial Street, Mumbai, Maharashtra - 400001',
    role: 'Premium Member',
    joinedDate: 'January 2024'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
            <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-slate-900 text-3xl font-black shadow-lg shadow-yellow-100">
              JD
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-sm text-primary-dark font-bold mb-4">{user.role}</p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => alert('Profile Edit Mode Enabled!')}
                className="w-full py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Edit Profile
              </button>
              <p className="text-xs text-slate-400 mt-2">Member since {user.joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Personal Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-slate-900 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-slate-900 font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</p>
                  <p className="text-slate-900 font-medium">{user.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">Account Settings</h3>
            </div>
            <div className="divide-y divide-slate-100">
              <button 
                onClick={() => alert('Security Settings Modal Open')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <Shield size={20} className="text-slate-400 group-hover:text-primary-dark" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Security & Password</p>
                    <p className="text-xs text-slate-500">Manage your password and 2FA</p>
                  </div>
                </div>
                <CreditCard size={16} className="text-slate-300" />
              </button>

              <button 
                onClick={() => alert('Notification Settings Modal Open')}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-4">
                  <Bell size={20} className="text-slate-400 group-hover:text-primary-dark" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">Notifications</p>
                    <p className="text-xs text-slate-500">Configure how you receive alerts</p>
                  </div>
                </div>
                <CreditCard size={16} className="text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
