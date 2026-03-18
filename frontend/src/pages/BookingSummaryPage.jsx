import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1); // 1: Identity, 2: Business/Individual, 3: Confirm
    const [accountType, setAccountType] = useState('Business'); // 'Individual' or 'Business'

    const handleProceed = () => {
        setIsModalOpen(true);
        setModalStep(1);
    };

    const handleNextStep = () => {
        if (modalStep < 3) {
            setModalStep(modalStep + 1);
        } else {
            setIsModalOpen(false);
            navigate('/dashboard');
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
                                    <h2 className="text-2xl font-bold text-slate-900">Mumbai, IN</h2>
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
                                    <h2 className="text-2xl font-bold text-slate-900">New Delhi, IN</h2>
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
                                        <span className="text-lg font-bold text-slate-900">{spec.value}</span>
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
                                    { label: 'Docket Charge', icon: FileTextIcon, amount: '₹50.00' },
                                    { label: 'GST (18%)', icon: ShieldCheckIcon, amount: '₹268.36' },
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
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative bg-white w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 space-y-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-slate-900 uppercase">Activate Your Account</h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-black transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Stepper */}
                                <div className="flex items-center justify-between relative px-4">
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                                    {[1, 2, 3].map((step) => (
                                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${modalStep >= step ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                                                {step === 1 && <User size={18} />}
                                                {step === 2 && <Briefcase size={18} />}
                                                {step === 3 && <Check size={18} />}
                                            </div>
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${modalStep >= step ? 'text-red-600' : 'text-slate-400'}`}>
                                                {step === 1 && 'Identity'}
                                                {step === 2 && 'Business'}
                                                {step === 3 && 'Confirm'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Step Content */}
                                <div className="py-2">
                                    {modalStep === 1 && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.1em] ml-1">Aadhar Number</label>
                                                    <input placeholder="Enter 12 digit Aadhar number" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold italic text-base focus:outline-none focus:border-red-600 transition-all" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.1em] ml-1">Mobile OTP</label>
                                                    <div className="flex gap-4">
                                                        <input placeholder="Enter OTP" className="flex-grow px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold italic text-base focus:outline-none focus:border-red-600 transition-all" />
                                                        <button className="px-6 bg-black text-white rounded-2xl font-black italic uppercase text-[10px] tracking-widest whitespace-nowrap">Send OTP</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 italic text-center leading-relaxed">Your Aadhar details will be verified securely. We do not store your Aadhar number.</p>
                                        </div>
                                    )}

                                    {modalStep === 2 && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setAccountType('Individual')}
                                                    className={`flex-1 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${accountType === 'Individual' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-400 border border-transparent'}`}
                                                >
                                                    Individual
                                                </button>
                                                <button
                                                    onClick={() => setAccountType('Business')}
                                                    className={`flex-1 py-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${accountType === 'Business' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-50 text-slate-400 border border-transparent'}`}
                                                >
                                                    Business
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.1em] ml-1">{accountType === 'Business' ? 'PAN Card Number' : 'Full Name'}</label>
                                                    <input placeholder={accountType === 'Business' ? 'Enter Business PAN' : 'Enter your name'} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold italic text-base focus:outline-none focus:border-red-600 transition-all" />
                                                </div>
                                                {accountType === 'Business' && (
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.1em] ml-1">GST Number</label>
                                                        <input placeholder="Enter Business GST number" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold italic text-base focus:outline-none focus:border-red-600 transition-all" />
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.1em] ml-1">Address</label>
                                                    <input placeholder="Enter complete address" className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold italic text-base focus:outline-none focus:border-red-600 transition-all" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {modalStep === 3 && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="bg-gray-50/50 rounded-3xl p-6 space-y-4 border border-gray-100">
                                                <h4 className="text-[10px] font-black uppercase text-gray-400 italic tracking-[0.2em] mb-4">Account Summary</h4>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-bold">Account Type</span>
                                                    <span className="text-gray-900 font-black italic">{accountType}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-bold">Aadhar</span>
                                                    <span className="text-gray-900 font-black italic">XXXX-XXXX-9988</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-bold">PAN</span>
                                                    <span className="text-gray-900 font-black italic">Not provided</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100 text-green-700">
                                                <CheckCircleIcon size={20} />
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">All details verified successfully</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Modal Footer Actions */}
                                <div className="flex gap-4">
                                    {modalStep > 1 && (
                                        <button
                                            onClick={handlePrevStep}
                                            className="w-20 flex items-center justify-center bg-slate-900 text-white rounded-xl transition-all hover:bg-slate-800"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNextStep}
                                        className="flex-grow bg-[#FF3B30] hover:bg-red-700 text-white py-5 rounded-xl font-bold uppercase tracking-wider text-sm shadow-sm transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        {modalStep === 3 ? 'Activate Account' : 'Continue'}
                                        <ArrowRight size={20} />
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

// Helper components for missing icons
const FileTextIcon = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" />
    </svg>
);

const ShieldCheckIcon = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
    </svg>
);

const CheckCircleIcon = (props) => (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default BookingSummaryPage;
