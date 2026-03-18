import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Building2, MapPin, 
  Shield, CheckCircle2, ArrowRight, ArrowLeft, 
  Lock, Globe, FileText, Smartphone 
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';

export default function ClientRegistrationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    clientName: '',
    mobile: '',
    phone: '',
    mobile2: '',
    email: '',
    companyType: '',
    companyName: '',
    panNo: '',
    gst: '',
    aadhaar: '',
    registerAddress: '',
    registerState: '',
    registerCity: '',
    registerPinCode: '',
    referBy: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restriction for mobile numbers (10 digits)
    if (['mobile', 'phone', 'mobile2'].includes(name)) {
      const val = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    // Restriction for pincode (6 digits)
    if (name === 'registerPinCode') {
      const val = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    // Restriction for Aadhaar (12 digits)
    if (name === 'aadhaar') {
      const val = value.replace(/\D/g, '').slice(0, 12);
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.clientName) return 'Client Name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.mobile) return 'Mobile Number is required';
    if (!/^[6-9]\d{9}$/.test(formData.mobile)) return 'Mobile must be 10 digits starting with 6-9';
    if (formData.phone && formData.phone.length !== 10) return 'Phone must be exactly 10 digits';
    if (formData.password && formData.password.length < 6) return 'Password must be at least 6 characters';
    
    if (step >= 2) {
      if (!formData.companyName) return 'Company Name is required';
      if (!formData.panNo) return 'PAN Number is required';
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo)) return 'Invalid PAN format';
      if (formData.aadhaar && formData.aadhaar.length !== 12) return 'Aadhaar must be exactly 12 digits';
    }

    if (step >= 3) {
      if (!formData.registerAddress) return 'Address is required';
      if (!formData.registerCity) return 'City is required';
      if (!formData.registerPinCode) return 'Pincode is required';
      if (formData.registerPinCode.length !== 6) return 'Pincode must be exactly 6 digits';
    }

    return null;
  };

  const nextStep = () => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);

    try {
      console.log('Submitting registration with data:', formData);
      const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.CLIENT_REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Registration error Response:', data);
        throw new Error(data?.message || data?.error || 'Registration failed');
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Submission catch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.98 }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24 pb-20">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-12 text-center border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 size={56} />
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter text-gray-900 mb-4 uppercase italic">Registration Successful!</h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">Your request for onboarding has been received. Our operations team will review your details and contact you shortly.</p>
          <button
            onClick={() => navigate('/login/client')}
            className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black italic uppercase tracking-widest text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-black/10 transition-all hover:-translate-y-1"
          >
            Go to Login
            <ArrowRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-red-100"
          >
            Become a partner
          </motion.div>
          <h1 className="text-5xl font-black italic tracking-tighter text-gray-900 uppercase">Client Registration</h1>
          <p className="mt-4 text-gray-500 font-medium text-lg">Streamline your freight operations with our platform.</p>
        </div>

        {/* Multi-step indicator */}
        <div className="flex justify-center items-center gap-4 max-w-xs mx-auto">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-red-600' : 'w-2.5 bg-gray-200'}`} />
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-[2.5rem] shadow-2xl p-10 sm:p-12 border border-gray-100 relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full opacity-50" />

          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-bold italic flex items-center gap-3">
              <Shield size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Primary Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Client Name" icon={User} name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Full Name" />
                    <Field label="Email Address" icon={Mail} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="work@company.com" />
                    <Field label="Mobile Number" icon={Smartphone} name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Primary Mobile" />
                    <Field label="Password" icon={Lock} name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Min. 8 characters" />
                    <Field label="Landline/Phone" icon={Phone} name="phone" value={formData.phone} onChange={handleChange} placeholder="Office Phone" />
                    <Field label="Secondary Mobile" icon={Smartphone} name="mobile2" value={formData.mobile2} onChange={handleChange} placeholder="Secondary Mobile" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-black rounded-full" />
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Company & Compliance</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Field label="Company Name" icon={Building2} name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Official Name" />
                    <div className="space-y-2 group">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors">Company Type</label>
                      <div className="relative">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
                        <select 
                          name="companyType"
                          value={formData.companyType}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold italic focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner appearance-none"
                        >
                          <option value="">Select Type</option>
                          <option value="Proprietorship">Proprietorship</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Private Limited">Private Limited</option>
                          <option value="Public Limited">Public Limited</option>
                        </select>
                      </div>
                    </div>
                    <Field label="PAN Card Number" icon={FileText} name="panNo" value={formData.panNo} onChange={handleChange} placeholder="ABCDE1234F" />
                    <Field label="GST Number" icon={Shield} name="gst" value={formData.gst} onChange={handleChange} placeholder="15 Digit GSTIN" />
                    <Field label="Aadhaar Number" icon={Shield} name="aadhaar" value={formData.aadhaar} onChange={handleChange} placeholder="12 Digit Number" />
                    <Field label="Referred By" icon={User} name="referBy" value={formData.referBy} onChange={handleChange} placeholder="Name or Email" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Registered Address</h3>
                  </div>

                  <div className="space-y-8">
                    <Field label="Street Address" icon={MapPin} name="registerAddress" value={formData.registerAddress} onChange={handleChange} placeholder="Plot, Building, Area" textarea />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <Field label="City" icon={Globe} name="registerCity" value={formData.registerCity} onChange={handleChange} placeholder="Mumbai" />
                      <Field label="State" icon={Globe} name="registerState" value={formData.registerState} onChange={handleChange} placeholder="Maharashtra" />
                      <Field label="Pincode" icon={MapPin} name="registerPinCode" value={formData.registerPinCode} onChange={handleChange} placeholder="400001" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-6 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-5 bg-gray-50 text-gray-900 rounded-[1.5rem] border border-gray-100 font-bold italic uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all flex items-center justify-center gap-4"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] py-5 bg-black text-white rounded-[1.5rem] font-bold italic uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-black/10 transition-all hover:-translate-y-1"
                >
                  Save & Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] py-5 bg-red-600 text-white rounded-[1.5rem] font-black italic uppercase tracking-widest text-xs hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-red-200 transition-all hover:-translate-y-1 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, textarea, name, type = "text", ...props }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 group-focus-within:text-red-500 transition-colors uppercase italic">{label}</label>
      <div className="relative">
        <Icon className="absolute left-5 top-5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={18} />
        {textarea ? (
          <textarea
            name={name}
            className="w-full pl-14 pr-6 py-4.5 bg-gray-50 border border-gray-100 rounded-3xl font-bold italic focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner h-32 resize-none pt-4"
            {...props}
          />
        ) : (
          <input
            name={name}
            type={type}
            className="w-full pl-14 pr-6 py-4.5 bg-gray-50 border border-gray-100 rounded-2xl font-bold italic focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner"
            {...props}
          />
        )}
      </div>
    </div>
  );
}
