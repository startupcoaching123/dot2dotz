import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Share2,
    Truck,
    Box,
    Scale,
    Check,
    HelpCircle,
    MessageSquare,
    Package,
    ArrowRight,
    X,
    ShieldCheck,
    Clock,
    ArrowLeft,
    CheckCircle2
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
        <div className="min-h-screen bg-slate-50 pt-15 pb-12 px-4 md:px-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Booking Summary</h1>
                        <p className="text-sm text-slate-500 mt-1">Review your shipment details and finalize the booking.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                            <Download size={16} />
                            Download PDF
                        </button>
                        <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                            <Share2 size={16} />
                            Share
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Side: Summary & Breakdown */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Route Map Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left flex-1">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Origin</span>
                                    <h2 className="text-xl font-bold">{origin || 'Mumbai, IN'}</h2>
                                </div>

                                <div className="flex flex-col items-center gap-2 relative px-8 w-full md:w-auto flex-1">
                                    <div className="w-full h-[2px] bg-slate-100 absolute top-1/2 left-0 right-0 -translate-y-1/2 overflow-hidden rounded-full">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                            className="w-1/2 h-full bg-slate-900"
                                        />
                                    </div>
                                    <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm relative z-10 text-slate-700">
                                        <Truck size={20} />
                                    </div>
                                </div>

                                <div className="text-center md:text-right flex-1">
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Destination</span>
                                    <h2 className="text-xl font-bold">{destination || 'New Delhi, IN'}</h2>
                                </div>
                            </div>
                        </motion.div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: Scale, label: 'Weight', value: '100 KG' },
                                { icon: Box, label: 'Volume', value: '0.16 CBM' },
                                { icon: Truck, label: 'Dimensions', value: '2x6x6 CM' }
                            ].map((spec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                                        <spec.icon size={20} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 block mb-0.5">{spec.label}</label>
                                        <span className="text-base font-semibold">
                                            {i === 0 && vehicle ? vehicle.capacity : spec.value}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Cost Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200"
                        >
                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-bold">Cost Breakdown</h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">INR (₹)</span>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Base Freight', icon: Package, amount: '1,540.00' },
                                    { label: 'Fuel Surcharge', icon: Truck, amount: '120.50' },
                                    { label: 'Docket Charge', icon: MessageSquare, amount: '50.00' },
                                    { label: 'GST (18%)', icon: ShieldCheck, amount: '268.36' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                                                <item.icon size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600">{item.label}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">₹{item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Price Sidebar */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-blue-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 space-y-8"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Total Price</label>
                                <div className="flex items-baseline gap-1">
                                    <h1 className="text-4xl font-bold tracking-tight">₹1,978<span className="text-2xl text-slate-400">.86</span></h1>
                                </div>
                                <p className="text-xs text-slate-400">Inclusive of all taxes & GST</p>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleProceed}
                                    className="w-full bg-white text-slate-900 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors focus:ring-4 focus:ring-white/20"
                                >
                                    Proceed to Booking
                                    <ArrowRight size={18} />
                                </button>
                                <button className="w-full bg-slate-800 text-white py-4 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors border border-slate-700">
                                    Save for Later
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 pt-6 border-t border-slate-800 text-xs font-medium text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    Secure SSL Checkout
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    Quote valid for 24 hours
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full border border-slate-100 flex items-center justify-center shrink-0">
                                    <HelpCircle size={20} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm">Need assistance?</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">Our logistics experts are available 24/7 to assist you with any questions.</p>
                                    <button className="flex items-center gap-2 text-slate-900 font-semibold text-sm hover:underline pt-1">
                                        <MessageSquare size={16} />
                                        Chat with Support
                                    </button>
                                </div>
                            </div>
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
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">Activate Account</h2>
                                    <p className="text-xs text-slate-500 mt-1">Complete your profile to proceed</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Stepper */}
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between relative">
                                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                                {['Identity', 'Details', 'Review'].map((stepName, index) => {
                                    const step = index + 1;
                                    const isActive = modalStep >= step;
                                    return (
                                        <div key={step} className="relative z-10 flex flex-col items-center gap-2 bg-slate-50/50">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${isActive ? 'bg-slate-900 text-white ring-4 ring-white' : 'bg-white text-slate-400 border border-slate-200 ring-4 ring-slate-50/50'}`}>
                                                {isActive && step < modalStep ? <Check size={16} /> : step}
                                            </div>
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                                {stepName}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 bg-white min-h-[320px]">
                                {modalStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">Aadhar Number</label>
                                                <input
                                                    name="aadharNumber"
                                                    value={regFormData.aadharNumber}
                                                    onChange={handleRegChange}
                                                    placeholder="0000 0000 0000"
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-slate-700">Mobile OTP</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        name="otp"
                                                        value={regFormData.otp}
                                                        onChange={handleRegChange}
                                                        placeholder="Enter 6-digit OTP"
                                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                                                    />
                                                    <button className="px-5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-semibold transition-colors shrink-0 border border-slate-200">
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                                            <ShieldCheck size={14} className="text-emerald-500" />
                                            <span>Secured by 256-bit encryption</span>
                                        </div>
                                    </motion.div>
                                )}

                                {modalStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        {/* Segmented Control */}
                                        <div className="flex p-1 bg-slate-100 rounded-lg">
                                            {['Individual', 'Business'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setAccountType(type)}
                                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${accountType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            <Field label={accountType === 'Business' ? 'Business Name' : 'Full Name'} name="businessName" placeholder="Enter name" value={regFormData.businessName} onChange={handleRegChange} />
                                            <Field label="Work Email" name="email" type="email" placeholder="hello@company.com" value={regFormData.email} onChange={handleRegChange} />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Field label="PAN Card" name="panNumber" placeholder="ABCDE1234F" value={regFormData.panNumber} onChange={handleRegChange} />
                                                {accountType === 'Business' && <Field label="GSTIN" name="gstNumber" placeholder="22AAAAA0000A1Z5" value={regFormData.gstNumber} onChange={handleRegChange} />}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {modalStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                        <div className="bg-slate-50 rounded-xl border border-slate-100 p-1">
                                            <SummaryRow label="Account Type" value={accountType} />
                                            <SummaryRow label="Name" value={regFormData.businessName} />
                                            <SummaryRow label="Email" value={regFormData.email} />
                                            <SummaryRow label="PAN" value={regFormData.panNumber} />
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                                            <CheckCircle2 size={20} className="shrink-0" />
                                            <p className="text-sm font-medium">All details verified. You are ready to finalize your booking.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    {modalStep > 1 && (
                                        <button onClick={handlePrevStep} className="px-4 py-2.5 text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors flex items-center gap-2">
                                            <ArrowLeft size={16} />
                                            Back
                                        </button>
                                    )}
                                </div>
                                <button
                                    onClick={handleNextStep}
                                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {modalStep === 3 ? 'Complete Setup' : 'Continue'}
                                    {modalStep !== 3 && <ArrowRight size={16} />}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Field = ({ label, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <input
            {...props}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
        />
    </div>
);

const SummaryRow = ({ label, value }) => (
    <div className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
        <span className="text-sm text-slate-500 font-medium">{label}</span>
        <span className="text-sm text-slate-900 font-semibold">{value || '—'}</span>
    </div>
);

export default BookingSummaryPage;