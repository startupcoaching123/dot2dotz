import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Building2, MapPin,
    Shield, CheckCircle2, ArrowRight, ArrowLeft,
    Lock, Globe, FileText, Smartphone, Truck,
    Eye, EyeOff
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

export default function VendorRegister() {
    const navigate = useNavigate();
    const { login } = useAuth();
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
        companyType: 'Private Limited',
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
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!formData.vendorName) newErrors.vendorName = 'Vendor Name is required';
            if (!formData.email) newErrors.email = 'Email is required';
            if (!formData.mobile) newErrors.mobile = 'Mobile is required';
            else if (!/^[6-9]\d{9}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits starting with 6-9';
            if (formData.phone && formData.phone.length !== 10) newErrors.phone = 'Phone must be exactly 10 digits';
            if (formData.mobile2 && !/^[6-9]\d{9}$/.test(formData.mobile2)) newErrors.mobile2 = 'Mobile 2 must be 10 digits starting with 6-9';
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        } else if (currentStep === 2) {
            if (!formData.companyName) newErrors.companyName = 'Company Name is required';
            if (!formData.panNo) newErrors.panNo = 'PAN Number is required';
            else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNo)) newErrors.panNo = 'Invalid PAN format';
            if (formData.aadhaar && formData.aadhaar.length !== 12) newErrors.aadhaar = 'Aadhaar must be exactly 12 digits';
        } else if (currentStep === 3) {
            if (!formData.registerAddress) newErrors.registerAddress = 'Address is required';
            if (!formData.registerCity) newErrors.registerCity = 'City is required';
            if (!formData.registerPinCode) newErrors.registerPinCode = 'Pincode is required';
            else if (formData.registerPinCode.length !== 6) newErrors.registerPinCode = 'Pincode must be 6 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(prev => Math.min(prev + 1, 3));
        }
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

            if (!res.ok) {
                throw new Error(data?.message || data?.error || 'Registration failed');
            }

            // Extract user and token if provided
            const user = data.user || data.data || data;
            const token = data.token || data.accessToken || (data.data && data.data.token);

            // if (token) {
            //     localStorage.setItem('authToken', token);
            // }

            // Login in context
            await login(user);

            Swal.fire({
                icon: 'success',
                title: 'Welcome Aboard!',
                text: 'Vendor registered successfully. Redirecting to your dashboard...',
                timer: 2000,
                showConfirmButton: false,
                background: '#fff',
                iconColor: '#f97316',
                customClass: {
                    title: 'text-2xl font-black uppercase italic',
                    popup: 'rounded-[2rem]'
                }
            });

            setTimeout(() => {
                navigate('/dashboard/vendor');
            }, 2000);

        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Error',
                text: err.message,
                confirmButtonColor: '#f97316',
                customClass: {
                    popup: 'rounded-[2rem]'
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50/50 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl opacity-50" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-orange-100 shadow-sm"
                    >
                        <Truck size={12} />
                        Vendor Onboarding
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-slate-900 uppercase leading-[0.9]">
                        Join the <span className="text-orange-600">Dot2Dotz</span> Network
                    </h1>
                    <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                        Powering transport businesses with modern technology
                    </p>
                </div>

                {/* Step Progress */}
                <div className="flex justify-between items-center max-w-md mx-auto mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
                        style={{ width: `${((step - 1) / 2) * 100}%` }}
                    />

                    {[1, 2, 3].map(i => (
                        <div key={i} className="relative z-10 flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-500 ${step >= i ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-white text-slate-300 border-2 border-slate-100'
                                    }`}
                            >
                                {step > i ? <CheckCircle2 size={20} /> : i}
                            </div>
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-slate-100 relative overflow-hidden"
                >
                    {/* Form Header */}
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-2 h-10 bg-orange-600 rounded-full shadow-sm" />
                        <div>
                            <h2 className="text-2xl font-black italic uppercase italic tracking-tighter text-slate-900 leading-none">
                                {step === 1 && "Personal Credentials"}
                                {step === 2 && "Business Identity"}
                                {step === 3 && "Operational Address"}
                            </h2>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-2">
                                Step {step} of 3
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-10"
                                >
                                    <Field
                                        label="Full Name" icon={User} name="vendorName"
                                        value={formData.vendorName} onChange={handleChange}
                                        error={errors.vendorName} placeholder="John Doe"
                                    />
                                    <Field
                                        label="Email Address" icon={Mail} name="email" type="email"
                                        value={formData.email} onChange={handleChange}
                                        error={errors.email} placeholder="john@example.com"
                                    />
                                    <Field
                                        label="Mobile Number" icon={Smartphone} name="mobile"
                                        value={formData.mobile} onChange={handleChange}
                                        error={errors.mobile} placeholder="9876543210"
                                    />
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 group-focus-within:text-orange-500 transition-colors italic">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full pl-16 pr-14 py-5 bg-slate-50 border-2 rounded-[1.5rem] font-bold italic focus:outline-none focus:bg-white transition-all shadow-inner ${errors.password ? 'border-red-100 text-red-600' : 'border-slate-50 focus:border-orange-500'}`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        {errors.password && <p className="text-[10px] text-red-500 font-black uppercase italic ml-1">{errors.password}</p>}
                                    </div>
                                    <Field
                                        label="Office Landline" icon={Phone} name="phone"
                                        value={formData.phone} onChange={handleChange}
                                        placeholder="022-22445566"
                                    />
                                    <Field
                                        label="Secondary Mobile" icon={Smartphone} name="mobile2"
                                        value={formData.mobile2} onChange={handleChange}
                                        placeholder="8877665544"
                                    />
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-10"
                                >
                                    <Field
                                        label="Company Name" icon={Building2} name="companyName"
                                        value={formData.companyName} onChange={handleChange}
                                        error={errors.companyName} placeholder="Express Logistics"
                                    />
                                    <div className="space-y-3 group">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 group-focus-within:text-orange-500 transition-colors italic">Business Structure</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                                            <select
                                                name="companyType"
                                                value={formData.companyType}
                                                onChange={handleChange}
                                                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] font-bold italic focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner appearance-none"
                                            >
                                                <option value="Proprietorship">Proprietorship</option>
                                                <option value="Partnership">Partnership</option>
                                                <option value="Private Limited">Private Limited</option>
                                                <option value="Public Limited">Public Limited</option>
                                            </select>
                                        </div>
                                    </div>
                                    <Field
                                        label="PAN Card Number" icon={FileText} name="panNo"
                                        value={formData.panNo} onChange={handleChange}
                                        error={errors.panNo} placeholder="ABCDE1234F"
                                    />
                                    <Field
                                        label="GSTIN Number" icon={Shield} name="gst"
                                        value={formData.gst} onChange={handleChange}
                                        placeholder="27ABCDE1234F1Z5"
                                    />
                                    <Field
                                        label="Aadhaar Number" icon={Shield} name="aadhaar"
                                        value={formData.aadhaar} onChange={handleChange}
                                        placeholder="234567890123"
                                    />
                                    <Field
                                        label="Referred By" icon={User} name="referBy"
                                        value={formData.referBy} onChange={handleChange}
                                        placeholder="ops@network.com"
                                    />
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <Field
                                        label="Full Registered Address" icon={MapPin} name="registerAddress"
                                        value={formData.registerAddress} onChange={handleChange}
                                        error={errors.registerAddress} placeholder="Office 405, Tech Center, MIDC"
                                        textarea
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <Field
                                            label="City" icon={Globe} name="registerCity"
                                            value={formData.registerCity} onChange={handleChange}
                                            error={errors.registerCity} placeholder="Mumbai"
                                        />
                                        <Field
                                            label="State" icon={Globe} name="registerState"
                                            value={formData.registerState} onChange={handleChange}
                                            placeholder="Maharashtra"
                                        />
                                        <Field
                                            label="Pincode" icon={MapPin} name="registerPinCode"
                                            value={formData.registerPinCode} onChange={handleChange}
                                            error={errors.registerPinCode} placeholder="400001"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-6 pt-10">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] font-bold italic uppercase tracking-widest text-[10px] border-2 border-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-4"
                                >
                                    <ArrowLeft size={16} />
                                    Go Back
                                </button>
                            )}
                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-[2] py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold italic uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 border-2 border-slate-900 hover:bg-orange-600 hover:border-orange-600 transition-all flex items-center justify-center gap-4 group"
                                >
                                    Continue
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-[2] py-5 bg-orange-600 text-white rounded-[1.5rem] font-black italic uppercase tracking-[0.2em] text-xs shadow-2xl shadow-orange-200 border-2 border-orange-600 hover:bg-slate-900 hover:border-slate-900 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Register Now
                                            <CheckCircle2 size={18} />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>

                <p className="text-center mt-12 text-slate-400 font-bold uppercase tracking-tighter text-xs italic">
                    Already have an account? <Link to="/login/vendor" className="text-orange-600 hover:underline">Sign In Instead</Link>
                </p>
            </div>
        </div>
    );
}

function Field({ label, icon: Icon, textarea, name, type = "text", error, ...props }) {
    return (
        <div className="space-y-3 group">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 group-focus-within:text-orange-500 transition-colors italic">{label}</label>
            <div className="relative">
                <Icon className="absolute left-6 top-6 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
                {textarea ? (
                    <textarea
                        name={name}
                        className={`w-full pl-16 pr-8 py-5 bg-slate-50 border-2 rounded-[2rem] font-bold italic focus:outline-none focus:bg-white transition-all shadow-inner h-32 resize-none pt-6 ${error ? 'border-red-100 text-red-600' : 'border-slate-50 focus:border-orange-500'}`}
                        {...props}
                    />
                ) : (
                    <input
                        name={name}
                        type={type}
                        className={`w-full pl-16 pr-8 py-5 bg-slate-50 border-2 rounded-[1.5rem] font-bold italic focus:outline-none focus:bg-white transition-all shadow-inner ${error ? 'border-red-100 text-red-600' : 'border-slate-50 focus:border-orange-500'}`}
                        {...props}
                    />
                )}
            </div>
            {error && <p className="text-[10px] text-red-500 font-black uppercase italic ml-1">{error}</p>}
        </div>
    );
}
