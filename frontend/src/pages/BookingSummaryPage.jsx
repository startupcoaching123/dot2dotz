import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Share2,
    MapPin,
    Truck,
    Box,
    Scale,
    ChevronRight,
    Check,
    HelpCircle,
    MessageSquare,
    Package,
    ArrowRight,
    X,
    Shield,
    ShieldCheck,
    Clock,
    CreditCard,
    Briefcase,
    User,
    Smartphone,
    ArrowLeft
} from 'lucide-react';

const BookingSummaryPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { origin, destination, vehicle } = location.state || {};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [accountType, setAccountType] = useState('Business');
    const [regFormData, setRegFormData] = useState({
        aadharNumber: '',
        otp: '',
        businessName: '',
        email: '',
        panNumber: '',
        gstNumber: ''
    });

    const handleProceed = () => {
        setIsModalOpen(true);
        setModalStep(1);
    };

    const handleRegChange = (e) => {
        const { name, value } = e.target;
        setRegFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = async () => {
        if (modalStep < 3) {
            setModalStep(modalStep + 1);
        } else {
            try {
                console.log('Registering client with data:', { ...regFormData, accountType });
                setIsModalOpen(false);
                navigate('/dashboard/client');
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handlePrevStep = () => {
        if (modalStep > 1) {
            setModalStep(modalStep - 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] pt-24 pb-12 px-4 md:px-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Top Action Bar */}
                <div className="flex justify-end gap-4">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={18} />
                        Download PDF
                    </button>
                    <button className="flex items-center gap-2 bg-[#FF3B30] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-sm hover:bg-red-600 transition-all">
                        <Share2 size={18} />
                        Share Quote
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Side: Summary & Breakdown */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Route Map Card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl p-10 relative overflow-hidden shadow-sm border border-slate-100"
                        >
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="text-center md:text-left flex-1">
                                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2 block">Origin</span>
                                    <h2 className="text-2xl font-bold text-slate-900">{origin || 'Mumbai, IN'}</h2>
                                </div>

                                <div className="flex flex-col items-center gap-2 relative px-10">
                                    <div className="w-full h-0.5 bg-gray-100 absolute top-1/2 left-0 right-0 -translate-y-1/2 overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="w-1/2 h-full bg-red-600"
                                        />
                                    </div>
                                    <div className="bg-white p-3 rounded-full border-2 border-gray-50 shadow-sm relative z-10">
                                        <Truck className="text-red-600" size={24} />
                                    </div>
                                </div>

                                <div className="text-center md:text-right flex-1">
                                    <span className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2 block">Destination</span>
                                    <h2 className="text-2xl font-bold text-slate-900">{destination || 'New Delhi, IN'}</h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: Scale, label: 'WEIGHT', value: '100 KG', color: 'bg-red-50 text-red-600' },
                                { icon: Box, label: 'VOLUME', value: '0.16 K.G.', color: 'bg-blue-50 text-blue-600' },
                                { icon: Truck, label: 'DIMENSIONS', value: '2X6X6X6 CM', color: 'bg-orange-50 text-orange-600' }
                            ].map((spec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.05 * i }}
                                    className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6"
                                >
                                    <div className={`w-14 h-14 rounded-xl ${spec.color} flex items-center justify-center`}>
                                        <spec.icon size={28} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">{spec.label}</label>
                                        <span className="text-lg font-bold text-slate-900">
                                            {i === 0 && vehicle ? vehicle.capacity : spec.value}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Cost Breakdown */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-10 shadow-sm border border-slate-100"
                        >
                            <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-50">
                                <h3 className="text-lg font-bold text-slate-900">Cost Breakdown</h3>
                                <span className="text-xs font-semibold text-slate-400">CHARGES IN INR (₹)</span>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { label: 'Base Freight', icon: Package, amount: '₹1,540.00' },
                                    { label: 'Fuel Surcharge', icon: Truck, amount: '₹120.50' },
                                    { label: 'Docket Charge', icon: MessageSquare, amount: '₹50.00' },
                                    { label: 'GST (18%)', icon: ShieldCheck, amount: '₹268.36' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="font-medium text-slate-600">{item.label}</span>
                                        </div>
                                        <span className="font-bold text-lg text-slate-900">{item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Price Sidebar */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl p-10 shadow-lg shadow-black/5 border border-slate-100 space-y-10"
                        >
                            <div className="flex flex-col items-center gap-4 py-4">
                                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                                    <Check size={32} />
                                </div>
                                <div className="text-center space-y-1">
                                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Estimated Price</label>
                                    <h1 className="text-4xl font-bold text-slate-900">₹ 1,978.86</h1>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">(Inclusive of all applicable taxes & GST)</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleProceed}
                                    className="w-full bg-[#FF3B30] text-white py-5 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:bg-black group shadow-sm"
                                >
                                    Proceed for Booking
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                                <button className="w-full bg-white text-slate-900 py-5 rounded-xl font-bold text-sm uppercase tracking-wider border border-slate-200 hover:bg-slate-50 transition-all">
                                    Save for Later
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-green-500" />
                                    SECURE CHECKOUT
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" />
                                    VALID FOR 24H
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-8 border border-slate-100 space-y-6"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <HelpCircle size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Need help with this quote?</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Our logistics experts are available 24/7 to assist you with any questions.</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase hover:underline">
                                <MessageSquare size={16} />
                                Chat with Support
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Account Activation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative bg-white w-full max-w-[440px] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Compact Modal Header */}
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-100">
                                        <Shield className="text-white" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Activate Account</h2>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">KYC VERIFICATION REQUIRED</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Minimal Stepper */}
                            <div className="px-8 py-5 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between relative">
                                <div className="absolute top-1/2 left-10 right-10 h-px bg-slate-200 -translate-y-1/2 z-0"></div>
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 text-[10px] font-bold ${modalStep >= step ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-white text-slate-300 border border-slate-100'}`}>
                                            {step}
                                        </div>
                                        <span className={`text-[7px] font-bold uppercase tracking-widest ${modalStep >= step ? 'text-red-600' : 'text-slate-400'}`}>
                                            {step === 1 ? 'Identity' : step === 2 ? 'Details' : 'Final'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Minimal Step Content */}
                            <div className="p-8 bg-white min-h-[300px]">
                                {modalStep === 1 && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-bold uppercase text-slate-400 tracking-widest ml-1">Aadhar Number</label>
                                                <input 
                                                    name="aadharNumber"
                                                    value={regFormData.aadharNumber}
                                                    onChange={handleRegChange}
                                                    placeholder="0000 0000 0000" 
                                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none text-sm tracking-[0.2em]" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-bold uppercase text-slate-400 tracking-widest ml-1">Mobile OTP</label>
                                                <div className="relative">
                                                    <input 
                                                        name="otp"
                                                        value={regFormData.otp}
                                                        onChange={handleRegChange}
                                                        placeholder="Enter 6-digit OTP" 
                                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none text-sm" 
                                                    />
                                                    <button className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-lg font-bold uppercase text-[7px] tracking-widest hover:bg-red-600 transition-colors">Send</button>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-[7px] text-slate-400 italic text-center font-medium">Secured by 256-bit encryption protocol</p>
                                    </div>
                                )}

                                {modalStep === 2 && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                                            {['Individual', 'Business'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setAccountType(type)}
                                                    className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-[8px] tracking-widest transition-all ${accountType === type ? 'bg-white text-red-600 shadow-sm' : 'bg-transparent text-slate-400'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <Field label={accountType === 'Business' ? 'Business Name' : 'Full Name'} name="businessName" placeholder="Enter name" value={regFormData.businessName} onChange={handleRegChange} />
                                            <Field label="Contact Email" name="email" type="email" placeholder="email@example.com" value={regFormData.email} onChange={handleRegChange} />
                                            <div className="grid grid-cols-2 gap-3">
                                                <Field label="PAN Card" name="panNumber" placeholder="ABCDE1234F" value={regFormData.panNumber} onChange={handleRegChange} />
                                                {accountType === 'Business' && <Field label="GSTIN" name="gstNumber" placeholder="22AAAAA0000A1Z5" value={regFormData.gstNumber} onChange={handleRegChange} />}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {modalStep === 3 && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                                            <SummaryRow label="Entity Type" value={accountType} />
                                            <SummaryRow label="Identity" value={regFormData.businessName} />
                                            <SummaryRow label="Work Mail" value={regFormData.email} />
                                            <SummaryRow label="KYC (PAN)" value={regFormData.panNumber} />
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 text-green-700">
                                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm text-green-600">
                                                <Check size={14} />
                                            </div>
                                            <span className="text-[8px] font-bold uppercase tracking-widest italic leading-none">Ready for deployment</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Minimal Footer */}
                            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-red-600 rounded-full" />
                                    <p className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em]">Dot2Dotz Engine v2.1</p>
                                </div>
                                <div className="flex gap-2">
                                    {modalStep > 1 && (
                                        <button onClick={handlePrevStep} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-slate-900 transition-colors">
                                            <ArrowLeft size={16} />
                                        </button>
                                    )}
                                    <button onClick={handleNextStep} className="px-6 h-10 bg-red-600 hover:bg-slate-900 text-white rounded-lg font-bold uppercase tracking-widest text-[8px] shadow-lg shadow-red-100 transition-all active:scale-95 italic min-w-[120px]">
                                        {modalStep === 3 ? 'Finalize' : 'Continue'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Field = ({ label, ...props }) => (
    <div className="space-y-1">
        <label className="text-[8px] font-bold uppercase text-slate-400 tracking-widest ml-1 italic">{label}</label>
        <input {...props} className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none italic text-sm" />
    </div>
);

const SummaryRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm border-b border-white pb-3 last:border-0 last:pb-0">
        <span className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.2em] italic">{label}</span>
        <span className="text-slate-900 font-bold italic text-[10px] uppercase truncate ml-4">{value || 'N/A'}</span>
    </div>
);

export default BookingSummaryPage;
