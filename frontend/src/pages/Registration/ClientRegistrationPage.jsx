import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Mail, 
    Smartphone, 
    Building2, 
    Check, 
    ArrowRight, 
    ArrowLeft, 
    Shield, 
    Briefcase,
    X,
    Eye,
    EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast/Toast';

export default function ClientRegistrationPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { success, error } = useToast();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [accountType, setAccountType] = useState('Business');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        aadharNumber: '',
        otp: '',
        businessName: '',
        email: '',
        panNumber: '',
        gstNumber: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (step < 3) {
            nextStep();
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.CLIENT_REGISTER}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    clientName: formData.businessName, // Map to backend expected field
                    companyType: accountType,
                    mobile: '9876543210', // Placeholder or captured from OTP step
                }),
            });

            const data = await res.json();
            if (res.ok) {
                success('Account activated successfully!');
                login(data.user || data.data || data);
                setTimeout(() => navigate('/dashboard/client'), 1500);
            } else {
                throw new Error(data?.message || 'Registration failed');
            }
        } catch (err) {
            error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 font-sans selection:bg-red-600 selection:text-white">
            <div className="w-full max-w-[540px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                
                {/* Header branding */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-red-600"></div>
                
                <div className="p-12 space-y-10">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase leading-none">Activate Your Account</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block">Initialize your logistics profile</p>
                        </div>
                        <img src="/logo.png" alt="Dot2Dotz" className="h-6 grayscale opacity-20" />
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-between relative px-4">
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100 -translate-y-1/2 z-0"></div>
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="relative z-10 flex flex-col items-center gap-3 bg-white px-2">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${step >= s ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200' : 'bg-white text-slate-300 border-slate-100'}`}>
                                    {s === 1 && <User size={20} />}
                                    {s === 2 && <Briefcase size={20} />}
                                    {s === 3 && <Check size={20} />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step >= s ? 'text-red-600' : 'text-slate-300'}`}>
                                    {s === 1 && 'Identity'}
                                    {s === 2 && 'Business'}
                                    {s === 3 && 'Confirm'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Content */}
                    <div className="py-2 min-h-[340px]">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 italic">Aadhar Number</label>
                                            <input 
                                                name="aadharNumber"
                                                value={formData.aadharNumber}
                                                onChange={handleChange}
                                                placeholder="Enter 12-digit Aadhaar number" 
                                                className="w-full px-6 py-5 bg-white border-2 border-red-500 rounded-2xl font-bold text-slate-900 focus:outline-none italic shadow-inner text-lg tracking-widest" 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 italic">Mobile OTP</label>
                                            <div className="relative">
                                                <input 
                                                    name="otp"
                                                    value={formData.otp}
                                                    onChange={handleChange}
                                                    placeholder="Enter OTP" 
                                                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none italic text-lg" 
                                                />
                                                <button type="button" className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all">Send OTP</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                        <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed text-center">Your Aadhaar details will be verified securely. We do not store your Aadhaar number.</p>
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
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 italic mb-4 block">Account Type</label>
                                        <div className="flex gap-4 p-1 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                                            {['Individual', 'Business'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setAccountType(type)}
                                                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${accountType === type ? 'bg-white text-red-600 shadow-md scale-[1.02]' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <Field label="Business Name" name="businessName" placeholder="Enter Business name" value={formData.businessName} onChange={handleChange} />
                                        <Field label="Email Address" name="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleChange} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Field label="PAN Card Number" name="panNumber" placeholder="Enter PAN number" value={formData.panNumber} onChange={handleChange} />
                                            {accountType === 'Business' && (
                                                <Field label="GST Number" name="gstNumber" placeholder="Enter GST number" value={formData.gstNumber} onChange={handleChange} />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 italic">Security Password</label>
                                            <div className="relative">
                                                <input 
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    placeholder="••••••••" 
                                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none italic" 
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors">
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8 py-4"
                                >
                                    <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                                        <h4 className="text-[10px] font-black uppercase text-red-600 italic tracking-[0.2em] mb-4">Final Confirmation</h4>
                                        <div className="space-y-4">
                                            <SummaryRow label="Account Entity" value={accountType} />
                                            <SummaryRow label="Name/Business" value={formData.businessName} />
                                            <SummaryRow label="Contact Email" value={formData.email} />
                                            <SummaryRow label="PAN Identification" value={formData.panNumber} />
                                            {accountType === 'Business' && <SummaryRow label="GST Registration" value={formData.gstNumber} />}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 bg-green-50 rounded-2xl border border-green-100 text-green-700">
                                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <Check size={16} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">Information sanity check complete</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-4 pt-6">
                        {step > 1 && (
                            <button
                                onClick={prevStep}
                                className="w-16 h-16 flex items-center justify-center bg-slate-900 text-white rounded-[1.5rem] transition-all hover:bg-slate-800 shadow-xl"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-grow bg-red-600 hover:bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-95 italic disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {step === 3 ? 'Complete Registration' : 'Continue'}
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, ...props }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 italic">{label}</label>
            <input {...props} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none italic" />
        </div>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm border-b border-white pb-3 last:border-0 last:pb-0">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{label}</span>
            <span className="text-slate-900 font-black italic text-[11px] uppercase tracking-tighter">{value || 'Not provided'}</span>
        </div>
    );
}
