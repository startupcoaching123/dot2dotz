import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Building2, MapPin, 
  Shield, Check, ArrowRight, ArrowLeft, 
  Lock, Globe, FileText, Smartphone, Truck,
  Eye, EyeOff, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast/Toast';

export default function VendorRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    vendorName: '',
    mobile: '',
    phone: '',
    mobile2: '',
    email: '',
    companyType: 'Proprietorship',
    companyName: '',
    panNo: '',
    gst: '',
    registerAddress: '',
    registerState: '',
    registerCity: '',
    registerPinCode: '',
    referBy: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limits
    if (['mobile', 'mobile2'].includes(name)) {
      const val = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }
    if (name === 'phone') {
        const val = value.replace(/\D/g, '').slice(0, 15);
        setFormData(prev => ({ ...prev, [name]: val }));
        return;
    }
    if (name === 'registerPinCode') {
      const val = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: val }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.vendorName) newErrors.vendorName = "Full name required";
      if (!formData.mobile) newErrors.mobile = "Mobile number required";
      if (!formData.email) newErrors.email = "Email required";
      if (!formData.password) newErrors.password = "Password required";
    } else if (currentStep === 2) {
      if (!formData.companyName) newErrors.companyName = "Company name required";
      if (!formData.panNo) newErrors.panNo = "PAN number required";
    } else if (currentStep === 3) {
      if (!formData.registerAddress) newErrors.registerAddress = "Address required";
      if (!formData.registerCity) newErrors.registerCity = "City required";
      if (!formData.registerPinCode) newErrors.registerPinCode = "Pin code required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.VENDOR_REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Registration failed');

      success('Welcome onboard! Authentication successful.');
      login(data.user || data.data || data);
      setTimeout(() => navigate('/dashboard/vendor'), 1500);
    } catch (err) {
      error(err.message || 'Connection timed out. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100 p-6 md:p-12 lg:p-24 flex flex-col items-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <header className="mb-12">
            <button onClick={() => navigate('/signup')} className="text-gray-400 hover:text-black transition-colors mb-6 text-sm flex items-center gap-2">
                <ArrowLeft size={16} />
                Back to selection
            </button>
            <h1 className="text-3xl font-medium tracking-tight mb-2">Vendor Onboarding</h1>
            <p className="text-gray-500 text-sm">Fill in your details to join the transport network.</p>
        </header>

        {/* Form Container */}
        <div className="space-y-12">
          {/* Progress Bar */}
          <div className="flex gap-2 h-1 w-full bg-gray-50 rounded-full overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className={`flex-1 transition-all duration-500 ${step >= i ? 'bg-black' : 'bg-transparent'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Name" name="vendorName" value={formData.vendorName} onChange={handleChange} error={errors.vendorName} />
                    <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                    <Field label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} error={errors.mobile} />
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-900">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-gray-50 border transition-all text-sm outline-none focus:border-black ${errors.password ? 'border-red-500' : 'border-gray-100'}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[10px] text-red-500">{errors.password}</p>}
                    </div>
                    <Field label="Landline" name="phone" value={formData.phone} onChange={handleChange} />
                    <Field label="Alternate Mobile" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="business"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Business Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} />
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-900">Entity Type</label>
                        <select
                            name="companyType"
                            value={formData.companyType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 text-sm outline-none focus:border-black transition-all appearance-none"
                        >
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Private Limited">Private Limited</option>
                            <option value="Limited">Limited</option>
                        </select>
                    </div>
                    <Field label="PAN Number" name="panNo" value={formData.panNo} onChange={handleChange} error={errors.panNo} />
                    <Field label="GST Number" name="gst" value={formData.gst} onChange={handleChange} />
                    <Field label="Referred By" name="referBy" value={formData.referBy} onChange={handleChange} />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Address Information</h2>
                  <Field label="Full Address" name="registerAddress" value={formData.registerAddress} onChange={handleChange} error={errors.registerAddress} textarea />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Field label="City" name="registerCity" value={formData.registerCity} onChange={handleChange} error={errors.registerCity} />
                    <Field label="State" name="registerState" value={formData.registerState} onChange={handleChange} />
                    <Field label="Pin Code" name="registerPinCode" value={formData.registerPinCode} onChange={handleChange} error={errors.registerPinCode} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-10 border-t border-gray-50">
                {step > 1 ? (
                    <button type="button" onClick={prevStep} className="text-gray-400 hover:text-black transition-colors text-sm flex items-center gap-2">
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                ) : <div />}

                {step < 3 ? (
                    <button type="button" onClick={nextStep} className="px-10 py-3 bg-black text-white text-sm hover:bg-gray-800 transition-all flex items-center gap-3">
                        Continue
                        <ChevronRight size={16} />
                    </button>
                ) : (
                    <button type="submit" disabled={isLoading} className="px-10 py-3 bg-red-600 text-white text-sm hover:bg-black transition-all disabled:opacity-50 flex items-center gap-3 font-medium">
                        {isLoading ? "Connecting..." : "Finalize Registration"}
                        {!isLoading && <Check size={16} />}
                    </button>
                )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, textarea, error, ...props }) {
  const Component = textarea ? 'textarea' : 'input';
  return (
    <div className="space-y-2 group">
      <label className="text-xs font-medium text-gray-900 group-focus-within:text-black transition-colors">{label}</label>
      <Component
        className={`w-full px-4 py-3 bg-gray-50 border transition-all text-sm outline-none focus:border-black ${error ? 'border-red-500' : 'border-gray-100 focus:bg-white'} ${textarea ? 'min-h-[100px] resize-none' : ''}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
