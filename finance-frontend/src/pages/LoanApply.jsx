import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, ChevronRight, FileText, CheckCircle2, MapPin, 
  Smartphone, Loader2, ArrowLeft, ArrowRight, Zap, 
  ShieldCheck, Wallet, CreditCard, User, AlertCircle, Clock
} from 'lucide-react';

const LoanApply = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEligible, setIsEligible] = useState(null); // null = loading, true = eligible, false = restricted
  const [restrictionReason, setRestrictionReason] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    husbandName: '',
    fatherName: '',
    coApplicantName: '',
    permanentAddress: '',
    liveLocation: '',
    customerMobile: '',
    nomineeMobile: '',
    loanAmount: '',
    loanType: 'Business Loan Monthly - 2Yr',
    purpose: '',
    repaymentFrequency: 'Monthly / Cash',
    preferredRepaymentDay: 'Wednesday',
    bankName: '',
    bankAccountNo: '',
    centreGroupNos: ''
  });

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/loans/my-loans`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const data = await response.json();
        if (data.success) {
          const activeLoan = data.data.find(l => l.status === 'approved' || l.status === 'pending');
          if (activeLoan) {
            if (activeLoan.status === 'pending') {
              setIsEligible(false);
              setRestrictionReason('You already have a pending loan application. Please wait for it to be processed.');
            } else if (activeLoan.pendingEMIs > 3) {
              setIsEligible(false);
              setRestrictionReason(`You have an active loan with ${activeLoan.pendingEMIs} EMIs remaining. You can apply for a new loan only when 3 or fewer EMIs are left.`);
            } else {
              setIsEligible(true);
            }
          } else {
            setIsEligible(true);
          }
        }
      } catch (error) {
        console.error('Error checking eligibility:', error);
        setIsEligible(true); // Default to true if check fails, or handle as error
      }
    };

    if (user?.role === 'admin') {
      setIsEligible(true); // Admins can always access for testing
    } else {
      checkEligibility();
    }
  }, [user]);

  if (isEligible === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-accent" size={48} />
        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Verifying Eligibility...</p>
      </div>
    );
  }

  if (isEligible === false) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-cosmic p-10 md:p-16 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-16 -mt-16" />
          
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-red-100 border-4 border-white rotate-3">
            <AlertCircle size={48} />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-primary tracking-tight">Application Restricted</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {restrictionReason}
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black tracking-widest text-xs uppercase hover:bg-primary-light transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Clock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Policy Updated: April 2024</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Personal', icon: User },
    { number: 2, title: 'Loan', icon: Wallet },
    { number: 3, title: 'Banking', icon: CreditCard },
    { number: 4, title: 'Review', icon: FileText },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const loc = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFormData(prev => ({ ...prev, liveLocation: loc }));
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/loans/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert('Application Submitted Successfully!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Submission failed');
      }
    } catch (error) {
      alert('Server connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center md:text-left space-y-2">
        <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
          <span className="px-3 py-1 bg-accent/10 text-accent-dark text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-accent/10">
            Application
          </span>
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Zap size={12} className="text-secondary-dark" />
            Fast Process
          </span>
        </div>
        <h1 className="text-4xl font-black text-primary tracking-tight">
          Apply for <span className="text-accent">Finance</span>
        </h1>
        <p className="text-slate-500 font-medium">Please fill out the form accurately for instant verification.</p>
      </div>

      {/* Steps Indicator */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-cosmic relative overflow-hidden">
        <div className="flex items-center justify-between relative px-2 md:px-10">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center gap-3 relative z-10">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-all duration-500 shadow-lg ${
                step >= s.number 
                  ? 'bg-primary border-primary text-secondary shadow-primary/20 scale-110' 
                  : 'bg-white border-slate-100 text-slate-300'
              }`}>
                {step > s.number ? <CheckCircle2 size={28} className="text-green-400" /> : s.number}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${step >= s.number ? 'text-primary' : 'text-slate-300'}`}>
                {s.title}
              </span>
            </div>
          ))}
          {/* Progress Bar Background */}
          <div className="absolute top-7 left-0 w-full h-1.5 bg-slate-50 -z-10 rounded-full" />
          {/* Progress Bar Fill */}
          <div 
            className="absolute top-7 left-0 h-1.5 bg-primary -z-10 transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(15,23,42,0.3)]" 
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} 
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-cosmic p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-bl-[10rem] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
        
        <form className="space-y-10 relative z-10" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Customer Name</label>
                <input required name="customerName" value={formData.customerName} onChange={handleInputChange} type="text" placeholder="Full Legal Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary placeholder:text-slate-300" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Husband/Father Name</label>
                <input required name="husbandName" value={formData.husbandName} onChange={handleInputChange} type="text" placeholder="Relative's Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary placeholder:text-slate-300" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Permanent Address</label>
                <textarea required name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} rows="3" placeholder="Full Address as per KYC" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary resize-none placeholder:text-slate-300" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mobile Number</label>
                <div className="relative group/input">
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-accent transition-colors" size={20} />
                  <input required name="customerMobile" value={formData.customerMobile} onChange={handleInputChange} type="tel" placeholder="10-digit number" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary placeholder:text-slate-300" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center justify-between">
                  Live Location
                  <button type="button" onClick={handleGetLocation} className="text-[9px] text-accent hover:underline flex items-center gap-1 font-black">
                    <MapPin size={12} /> Detect
                  </button>
                </label>
                <input required name="liveLocation" value={formData.liveLocation} onChange={handleInputChange} type="text" placeholder="GPS Coordinates" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary placeholder:text-slate-300" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Loan Amount Required</label>
                <div className="relative group/input">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">₹</span>
                  <input required name="loanAmount" value={formData.loanAmount} onChange={handleInputChange} type="number" placeholder="e.g. 50000" className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-black text-primary text-xl placeholder:text-slate-200" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Loan Product</label>
                <select name="loanType" value={formData.loanType} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary appearance-none cursor-pointer">
                  <option>Business Loan Monthly - 2Yr</option>
                  <option>Micro-Finance Weekly</option>
                  <option>Personal Gold Loan</option>
                  <option>Housing Support</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Purpose of Loan</label>
                <input required name="purpose" value={formData.purpose} onChange={handleInputChange} type="text" placeholder="e.g. Shop Expansion" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Repayment Schedule</label>
                <select name="repaymentFrequency" value={formData.repaymentFrequency} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary appearance-none cursor-pointer">
                  <option>Monthly / Cash</option>
                  <option>Weekly / Digital</option>
                  <option>Fortnightly</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Bank Name</label>
                <input required name="bankName" value={formData.bankName} onChange={handleInputChange} type="text" placeholder="Bank Branch Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Account Number</label>
                <input required name="bankAccountNo" value={formData.bankAccountNo} onChange={handleInputChange} type="text" placeholder="Full Account Number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none font-bold text-primary" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">KYC Document Upload</label>
                <div className="border-4 border-dashed border-slate-50 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4 hover:bg-slate-50/50 hover:border-accent/20 transition-all cursor-pointer group/upload">
                  <div className="w-20 h-20 bg-accent/10 rounded-[2rem] flex items-center justify-center text-accent group-hover/upload:scale-110 transition-transform duration-500 shadow-xl shadow-accent/5">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-primary text-lg tracking-tight">Capture or Upload KYC</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Aadhar, PAN or Voter ID</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100 border-4 border-white rotate-6">
                <ShieldCheck size={48} />
              </div>
              <h2 className="text-3xl font-black text-primary tracking-tight mb-3">Review & Submit</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10">Your application is ready for final verification. Please ensure all details are correct.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-6 bg-slate-50 rounded-3xl text-left border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Loan Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Product:</span> <span className="font-black text-primary">{formData.loanType}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Amount:</span> <span className="font-black text-primary">₹{Number(formData.loanAmount).toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl text-left border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer Info</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Name:</span> <span className="font-black text-primary">{formData.customerName}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-500 font-bold">Phone:</span> <span className="font-black text-primary">{formData.customerMobile}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            {step > 1 && (
              <button 
                type="button" 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-5 bg-white border border-slate-200 text-primary font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
              >
                <ArrowLeft size={18} /> Previous Step
              </button>
            )}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-[2] py-5 text-white font-black rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 group ${
                step === 4 ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-primary hover:bg-primary-light shadow-primary/20'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {step === 4 ? 'Confirm & Submit Application' : 'Next Step'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Trust Footer */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400 pb-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-green-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-secondary-dark" />
          <span className="text-[10px] font-black uppercase tracking-widest">Instant Decision Engine</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">Digital Documentation</span>
        </div>
      </div>
    </div>
  );
};

export default LoanApply;
