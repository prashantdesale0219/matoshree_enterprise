import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Smartphone, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Account Created Successfully! Please login.');
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Server connection error');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 overflow-hidden">
            <img src={logo} alt="Matoshree Enterprise Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Create Account</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Join Matoshree Enterprise today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-secondary/5 border border-secondary/10 rounded-xl flex items-center gap-3 text-secondary text-sm font-bold">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter your email" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Mobile Number</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="tel" 
                value={formData.mobile}
                onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                placeholder="Enter your mobile" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Create a password" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95 mt-6"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary font-black hover:underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
