import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Package,
    ArrowRight,
    MapPin,
    Truck,
    X,
    Smartphone,
    CheckCircle2,
    Scale,
    Box,
    Navigation2,
    Zap,
    Target,
    Activity
} from 'lucide-react';
import truckImg from '../assets/truck2.png';

const PTLEstimationPage = () => {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [weight, setWeight] = useState('');
    const [boxes, setBoxes] = useState(1);
    const [dimensions, setDimensions] = useState({ length: '', width: '', height: '' });
    const [activeSection, setActiveSection] = useState('route'); // 'route' or 'load'
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Modal Flow States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const validatePincode = (pincode) => {
        return /^[0-9]{6}$/.test(pincode);
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!validatePincode(origin)) {
            newErrors.origin = 'Please enter a valid 6-digit pincode';
        }
        if (!validatePincode(destination)) {
            newErrors.destination = 'Please enter a valid 6-digit pincode';
        }
        if (!weight || parseFloat(weight) <= 0) {
            newErrors.weight = 'Please enter a valid weight';
        }
        if (!boxes || parseInt(boxes) <= 0) {
            newErrors.boxes = 'Please enter a valid number of boxes';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProceed = () => {
        if (validateForm()) {
            setIsModalOpen(true);
            setModalStep(1);
        }
    };

    const handleNextStep = () => {
        if (modalStep < 3) {
            if (modalStep === 1) {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                    setModalStep(modalStep + 1);
                }, 1500);
            } else {
                setModalStep(modalStep + 1);
            }
        } else {
            setIsModalOpen(false);
            navigate('/booking-summary');
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            }
        }
        if (e.key === 'Enter' && otp.every(digit => digit !== '')) {
            handleNextStep();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isModalOpen) {
            setIsModalOpen(false);
            setErrors({});
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = pastedData.split('');
        while (newOtp.length < 6) newOtp.push('');
        setOtp(newOtp);
        
        const focusIndex = Math.min(pastedData.length, 5);
        const nextInput = document.getElementById(`otp-${focusIndex}`);
        if (nextInput) nextInput.focus();
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] text-gray-900 pt-24 pb-12 px-4 md:px-8 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative" onKeyDown={handleKeyDown}>

            {/* Background Aesthetic Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #E5E7EB 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-600 h-1.5 w-12 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 italic">Precision Logistics</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-gray-900">
                            PTL <span className="text-transparent" style={{ WebkitTextStroke: '1px #111' }}>Estimate</span> Console
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Live Rates</p>
                                <p className="text-sm font-black italic">Standard Market+</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Left Column: Interactive Form Controls */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Progress Stepper */}
                        <div className="flex bg-white/50 backdrop-blur-md p-2 rounded-[2rem] border border-white gap-2 shadow-sm">
                            <button
                                onClick={() => setActiveSection('route')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black italic uppercase text-[10px] tracking-widest ${activeSection === 'route' ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-white'}`}
                            >
                                <Navigation2 size={14} />
                                01. Route Map
                            </button>
                            <button
                                onClick={() => setActiveSection('load')}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl transition-all font-black italic uppercase text-[10px] tracking-widest ${activeSection === 'load' ? 'bg-black text-white shadow-xl shadow-black/10' : 'text-gray-400 hover:text-black hover:bg-white'}`}
                            >
                                <Package size={14} />
                                02. Load Specs
                            </button>
                        </div>

                        {/* Content Card */}
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] border border-gray-100 p-8 md:p-12 shadow-xl shadow-black/[0.02] relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-10 w-64 h-64 bg-red-600/5 rounded-full blur-[80px] pointer-events-none"></div>

                            {activeSection === 'route' && (
                                <div className="space-y-12">
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                                <Target size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black italic uppercase tracking-tight">Define Routing</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect your origin and destination</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                                            {/* Connecting Line Aesthetic */}
                                            <div className="hidden md:flex absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-red-600/20 via-gray-100 to-transparent -translate-x-1/2 flex-col items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.2em] mb-3 block ml-1">Origin Pincode</label>
                                                    <div className="relative">
                                                        <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                                        <input
                                                            type="text"
                                                            value={origin}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                                setOrigin(value);
                                                                if (errors.origin) setErrors({ ...errors, origin: '' });
                                                            }}
                                                            placeholder="e.g. 110001"
                                                            className={`w-full pl-16 pr-8 py-5 bg-gray-50/50 border-2 rounded-[2rem] font-black italic text-xl outline-none transition-all placeholder:text-gray-300 ${
                                                                errors.origin 
                                                                    ? 'bg-red-50 border-red-500 focus:border-red-600' 
                                                                    : 'border-transparent focus:bg-white focus:border-black'
                                                            }`}
                                                        />
                                                        {errors.origin && (
                                                            <p className="absolute -bottom-6 left-1 text-[9px] text-red-500 font-black uppercase tracking-widest">
                                                                {errors.origin}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.2em] mb-3 block ml-1">Destination Pincode</label>
                                                    <div className="relative">
                                                        <MapPin size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                                                        <input
                                                            type="text"
                                                            value={destination}
                                                            onChange={(e) => {
                                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                                setDestination(value);
                                                                if (errors.destination) setErrors({ ...errors, destination: '' });
                                                            }}
                                                            placeholder="e.g. 400001"
                                                            className={`w-full pl-16 pr-8 py-5 bg-gray-50/50 border-2 rounded-[2rem] font-black italic text-xl outline-none transition-all placeholder:text-gray-300 ${
                                                                errors.destination 
                                                                    ? 'bg-red-50 border-red-500 focus:border-red-600' 
                                                                    : 'border-transparent focus:bg-white focus:border-black'
                                                            }`}
                                                        />
                                                        {errors.destination && (
                                                            <p className="absolute -bottom-6 left-1 text-[9px] text-red-500 font-black uppercase tracking-widest">
                                                                {errors.destination}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setActiveSection('load')}
                                        className="w-full md:w-fit px-12 py-5 bg-black text-white rounded-[2rem] font-black italic uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-black/10 hover:bg-red-600 active:scale-95"
                                    >
                                        Next Component
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            )}

                            {activeSection === 'load' && (
                                <div className="space-y-12">
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                                                <Zap size={24} />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black italic uppercase tracking-tight">Cargo Specifications</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detail your shipment dimensions</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.2em] mb-1 block ml-1">Weight Metric</label>
                                                <div className="flex bg-gray-50/50 border-2 border-transparent rounded-3xl overflow-hidden h-16 focus-within:bg-white focus-within:border-black transition-all">
                                                    <input
                                                        type="number"
                                                        value={weight}
                                                        onChange={(e) => {
                                                            setWeight(e.target.value);
                                                            if (errors.weight) setErrors({ ...errors, weight: '' });
                                                        }}
                                                        placeholder="0.00"
                                                        className={`flex-1 px-8 font-black italic text-3xl outline-none bg-transparent ${
                                                            errors.weight ? 'bg-red-50' : ''
                                                        }`}
                                                    />
                                                    <div className="px-8 flex items-center border-l border-gray-100">
                                                        <select className="bg-transparent font-black italic uppercase text-xs outline-none cursor-pointer">
                                                            <option>kg</option>
                                                            <option>ton</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {errors.weight && (
                                                    <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2">
                                                        {errors.weight}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.2em] mb-1 block ml-1">Number of Boxes</label>
                                                <div className="flex bg-gray-50/50 border-2 border-transparent rounded-3xl overflow-hidden h-16 focus-within:bg-white focus-within:border-black transition-all">
                                                    <input
                                                        type="number"
                                                        value={boxes}
                                                        onChange={(e) => {
                                                            setBoxes(e.target.value);
                                                            if (errors.boxes) setErrors({ ...errors, boxes: '' });
                                                        }}
                                                        className={`flex-1 px-8 font-black italic text-3xl outline-none bg-transparent ${
                                                            errors.boxes ? 'bg-red-50' : ''
                                                        }`}
                                                    />
                                                    <div className="px-8 flex items-center border-l border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                        Units
                                                    </div>
                                                </div>
                                                {errors.boxes && (
                                                    <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mt-2">
                                                        {errors.boxes}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2 space-y-4">
                                                <label className="text-xs font-black uppercase text-gray-400 italic tracking-[0.2em] mb-1 block ml-1">Dimensions (L x W x H)</label>
                                                <div className="grid grid-cols-3 gap-4 h-16">
                                                    <input 
                                                        placeholder="L" 
                                                        value={dimensions.length}
                                                        onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                                                        className="bg-gray-50/50 border-2 border-transparent rounded-3xl font-black italic text-2xl text-center outline-none focus:bg-white focus:border-black transition-all" 
                                                    />
                                                    <input 
                                                        placeholder="W" 
                                                        value={dimensions.width}
                                                        onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                                                        className="bg-gray-50/50 border-2 border-transparent rounded-3xl font-black italic text-2xl text-center outline-none focus:bg-white focus:border-black transition-all" 
                                                    />
                                                    <input 
                                                        placeholder="H" 
                                                        value={dimensions.height}
                                                        onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                                                        className="bg-gray-50/50 border-2 border-transparent rounded-3xl font-black italic text-2xl text-center outline-none focus:bg-white focus:border-black transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setActiveSection('route')}
                                            className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[2rem] font-black italic uppercase tracking-[0.2em] text-xs transition-all hover:bg-gray-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleProceed}
                                            disabled={isLoading}
                                            className="flex-1 py-5 bg-red-600 text-white rounded-[2rem] font-black italic uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-4 hover:bg-black group shadow-xl shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Calculate Quote
                                                    <Zap size={18} className="fill-current" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Feature Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                            {[
                                { icon: Truck, label: 'Doorstep Pickup' },
                                { icon: Activity, label: 'Live Tracking' },
                                { icon: Target, label: 'Precision Tech' },
                                { icon: Plus, label: 'Extra Security' },
                            ].map((badge, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-red-600 shadow-sm">
                                        <badge.icon size={14} />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 italic">{badge.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Visualization & Promo */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">

                        {/* Summary Visualization Card */}
                        <div className="bg-white rounded-[3rem] border border-gray-100 p-10 space-y-10 relative overflow-hidden shadow-2xl shadow-black/[0.03]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[4rem]"></div>

                            <div className="relative z-10 space-y-10">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] italic">Instant Summary</label>
                                    <h3 className="text-sm font-black italic text-gray-400 uppercase">Token: #P782-99</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                                <Scale size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Gross Weight</label>
                                                <p className="text-xl font-black italic">{weight || '0.00'} <span className="text-[10px] text-gray-400">KG</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                                <Box size={20} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Units</label>
                                                <p className="text-xl font-black italic">{boxes} <span className="text-[10px] text-gray-400">BOXES</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-gray-50 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Cost</span>
                                            <span className="text-4xl font-black italic text-red-600 tracking-tighter">₹ 0.00</span>
                                        </div>
                                        <p className="text-[8px] font-bold text-gray-300 uppercase leading-relaxed text-center">Final charges confirmed after physical audit</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Branding/Promo Card */}
                        <div className="bg-black rounded-[3rem] p-10 h-56 relative overflow-hidden group cursor-pointer shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-3xl font-black italic text-white uppercase leading-none tracking-tighter">Prime-Link<br /><span className="text-red-600">Route 1</span></h3>
                                <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                                    <Zap size={14} className="fill-white text-white" />
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.2em]">Verified Lane</span>
                                </div>
                            </div>
                            <img
                                src={truckImg}
                                alt="Truck"
                                className="absolute bottom-[-15px] right-[-30px] w-72 h-auto object-contain z-0 drop-shadow-[0_20px_40px_rgba(255,59,48,0.2)] transition-transform group-hover:translate-x-4 group-hover:-rotate-2 duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Console Modal - Light Mode Refined */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative bg-white text-gray-900 w-full max-w-[480px] rounded-[3.5rem] overflow-hidden shadow-2xl p-12 border border-white"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-10 right-10 text-gray-300 hover:text-black transition-colors"
                            >
                                <X size={28} />
                            </button>

                            {modalStep === 1 && (
                                <div className="space-y-12 py-4">
                                    <div className="space-y-4 text-center md:text-left">
                                        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto md:mx-0">
                                            <Smartphone size={28} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Client Auth</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Verify your session to finalize</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black uppercase text-gray-400 italic tracking-[0.2em] ml-2">Mobile Terminal</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                                                placeholder="+91 - 00000 00000"
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-3xl font-black italic text-xl outline-none focus:bg-white focus:border-black transition-all shadow-inner"
                                            />
                                        </div>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={isLoading}
                                            className="w-full bg-black text-white py-6 rounded-[2rem] font-black italic uppercase tracking-[0.2em] text-xs transition-all shadow-2xl hover:bg-red-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </div>
                                            ) : (
                                                'Request Security Key'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-12 py-4 text-center">
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Verification</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">6-Digit token sent to ending in {phone.slice(-4) || 'XXXX'}</p>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex justify-between gap-3 px-2">
                                            {[...Array(6)].map((_, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    maxLength="1"
                                                    value={otp[i]}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                                    onPaste={handleOtpPaste}
                                                    className="w-full h-16 bg-gray-50 border-2 border-transparent rounded-2xl text-center font-black text-2xl italic focus:border-black focus:bg-white focus:outline-none transition-all shadow-inner"
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={isLoading}
                                            className="w-full bg-red-600 text-white py-6 rounded-[2rem] font-black italic uppercase tracking-[0.2em] text-xs transition-all shadow-2xl hover:bg-black active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Verifying...
                                                </div>
                                            ) : (
                                                'Verify & Authorize'
                                            )}
                                        </button>
                                        <div className="flex flex-col gap-2">
                                            <button className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-black transition-all">Didn't receive code? Resend</button>
                                            <button onClick={() => setModalStep(1)} className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:underline transition-all font-italic">Modify Terminal #</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="space-y-12 py-12 text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/10 blur-[60px] rounded-full"></div>
                                        <div className="w-32 h-32 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto relative z-10 border-4 border-white shadow-2xl">
                                            <CheckCircle2 size={80} strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Success</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Console identity confirmed</p>
                                    </div>
                                    <button
                                        onClick={handleNextStep}
                                        className="w-full bg-black text-white py-6 rounded-[2rem] font-black italic uppercase tracking-[0.2em] text-xs transition-all shadow-2xl hover:bg-green-600 active:scale-95"
                                    >
                                        Go to Booking Summary
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PTLEstimationPage;
