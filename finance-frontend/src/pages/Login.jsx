import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, CreditCard, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Visual/Marketing (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center p-20 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] animate-bounce duration-[10s]"></div>
        </div>

        <div className="relative z-10 space-y-10">
          <Link to="/" className="flex items-center gap-3 group inline-block">
            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform shadow-2xl shadow-secondary/20">
              <CreditCard className="text-primary font-black" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter">
                FINANCE<span className="text-secondary">PRO</span>
              </h1>
              <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Cosmic Enterprise</p>
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="text-6xl font-black tracking-tight leading-[1.1]">
              Secure Your <br />
              <span className="text-secondary">Financial Future</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              Experience the next generation of digital lending. Fast, secure, and fully transparent loan management at your fingertips.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10">
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-accent/20 transition-colors">
                <ShieldCheck className="text-secondary" size={24} />
              </div>
              <div>
                <p className="font-black text-sm tracking-tight">Bank-Grade Security</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">SSL Encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-accent/20 transition-colors">
                <Zap className="text-secondary" size={24} />
              </div>
              <div>
                <p className="font-black text-sm tracking-tight">Instant Approval</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Real-time processing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Credit Card Mockup */}
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[300px] bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl rotate-[-15deg] shadow-2xl p-10 hidden xl:block animate-in slide-in-from-right-20 duration-1000">
          <div className="flex justify-between items-start mb-20">
            <div className="w-16 h-12 bg-secondary/80 rounded-lg"></div>
            <Zap className="text-white/20" size={40} />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-48 bg-white/20 rounded-full"></div>
            <div className="h-2 w-32 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-background lg:rounded-l-[4rem] flex flex-col justify-center p-8 md:p-20 relative overflow-hidden shadow-[-20px_0_50px_rgba(0,0,0,0.2)]">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-12 flex justify-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="text-secondary" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-primary">
              FINANCE<span className="text-accent">PRO</span>
            </h1>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto space-y-10">
          <div>
            <h2 className="text-4xl font-black text-primary tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-bold">Please enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all font-bold text-primary shadow-sm group-hover:border-slate-300"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                <Link to="/forgot-password" title="Coming soon" className="text-[10px] font-black text-accent uppercase tracking-[0.1em] hover:text-accent-dark">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all font-bold text-primary shadow-sm group-hover:border-slate-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary hover:bg-primary-light text-white rounded-[1.5rem] font-black tracking-widest text-xs uppercase flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center">
            <p className="text-slate-500 font-bold text-sm">
              New to Matoshree Enterprise?{' '}
              <Link to="/register" className="text-secondary font-black hover:underline underline-offset-4">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2024 Matoshree Enterprise. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
