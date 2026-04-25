import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CreditCard, ShieldCheck, TrendingUp, Users, CheckCircle2, 
  ArrowRight, Landmark, BadgeCheck, FileText, PhoneCall, 
  MapPin, HelpCircle, LayoutDashboard, LogIn, ChevronRight
} from 'lucide-react';
import logo from '../assets/logo.png';
import heroImg from '../assets/hero.png';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 rotate-3 group-hover:rotate-0">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-black text-primary tracking-tight mb-3">{title}</h3>
    <p className="text-slate-500 font-medium text-sm leading-relaxed">{description}</p>
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4 shadow-sm' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Matoshree" className="h-10 w-10 object-contain rounded-xl shadow-lg" />
            <span className="text-xl font-black text-primary tracking-tighter">MATOSHREE <span className="text-secondary">ENTERPRISE</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-xs font-black text-primary uppercase tracking-widest hover:text-secondary transition-colors">Services</a>
            <a href="#about" className="text-xs font-black text-primary uppercase tracking-widest hover:text-secondary transition-colors">About Us</a>
            {user ? (
              <Link to="/dashboard" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-primary/20">
                <LayoutDashboard size={14} /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-primary/20">
                <LogIn size={14} /> Admin/User Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div>
                <span className="px-4 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-secondary/20">
                  Trust & Reliability Since 2024
                </span>
                <h1 className="text-6xl lg:text-7xl font-black text-primary tracking-tighter leading-[0.9] mt-6">
                  Simple Loans for <span className="text-secondary underline decoration-secondary/20 underline-offset-8">Your Dreams.</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium mt-8 leading-relaxed max-w-xl">
                  Empowering local businesses and individuals with flexible, fast, and secure financial solutions. Apply today and get instant approval.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleApplyClick}
                  className="px-8 py-5 bg-secondary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-secondary-dark transition-all shadow-2xl shadow-secondary/30 flex items-center justify-center gap-3 group active:scale-95"
                >
                  Apply For Loan <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <a 
                  href="#services"
                  className="px-8 py-5 bg-white border border-slate-200 text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95"
                >
                  Our Services <ChevronRight size={18} />
                </a>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Joined by <span className="text-primary">1000+</span> Customers
                </p>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="absolute -inset-4 bg-secondary/10 rounded-[3rem] blur-3xl -z-10" />
              <img 
                src={heroImg} 
                alt="Finance" 
                className="w-full h-auto rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" 
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500 text-white rounded-xl">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified</p>
                    <p className="text-sm font-black text-primary">100% Secure Process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Loans Disbursed', value: '₹5Cr+', icon: Landmark },
              { label: 'Active Members', value: '1.2K+', icon: Users },
              { label: 'Approval Rate', value: '99%', icon: BadgeCheck },
              { label: 'Daily Support', value: '24/7', icon: PhoneCall },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-secondary mx-auto mb-4">
                  <stat.icon size={24} />
                </div>
                <h4 className="text-3xl font-black text-white tracking-tight">{stat.value}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Financial Products</span>
            <h2 className="text-5xl font-black text-primary tracking-tight">Tailored Solutions for <span className="text-secondary">Every Need.</span></h2>
            <p className="text-slate-500 font-medium">We offer a wide range of loan products designed to help you achieve your personal and business goals with ease.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users}
              title="Group Lending"
              description="Empowering small groups and communities with collective financial support and shared responsibility."
            />
            <FeatureCard 
              icon={Landmark}
              title="Business Loans"
              description="Fuel your entrepreneurial dreams with our quick and hassle-free business capital solutions."
            />
            <FeatureCard 
              icon={CreditCard}
              title="Personal Finance"
              description="From education to medical needs, we provide instant personal loans for all your urgent requirements."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Our Story</span>
                <h2 className="text-5xl font-black text-primary tracking-tight leading-none">Your Trusted Partner in <span className="text-secondary">Progress.</span></h2>
              </div>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                At Matoshree Enterprise, we believe that everyone deserves a fair chance at financial success. Our mission is to provide accessible, transparent, and ethical financial services to the underserved sections of society.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  'Easy Documentation',
                  'Fast Disbursement',
                  'No Hidden Charges',
                  'Flexible Tenure',
                  'Minimal Interest',
                  'Excellent Support'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-secondary text-white rounded-full flex items-center justify-center">
                      <CheckCircle2 size={12} />
                    </div>
                    <span className="text-sm font-black text-primary uppercase tracking-wider">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
              <h3 className="text-2xl font-black text-primary tracking-tight">Have Questions?</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-slate-50 text-primary rounded-2xl">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Call Us</p>
                    <p className="text-lg font-black text-primary">+91 9913687632</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-slate-50 text-primary rounded-2xl">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="text-lg font-black text-primary">RamiPark, Dindoli surat, Gujarat</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-900 transition-all shadow-lg"
              >
                Contact Us Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <Link to="/" className="flex items-center gap-3 justify-center">
            <img src={logo} alt="Matoshree" className="h-8 w-8 object-contain rounded-lg" />
            <span className="text-lg font-black text-primary tracking-tighter">MATOSHREE <span className="text-secondary uppercase">Enterprise</span></span>
          </Link>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
            © 2024 Matoshree Enterprise. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
