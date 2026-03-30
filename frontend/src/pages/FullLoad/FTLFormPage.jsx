import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Info, 
    ArrowLeft, 
    ChevronDown, 
    Smartphone, 
    CheckCircle2, 
    X,
    Truck,
    Box,
    Layers,
    Monitor,
    HelpCircle,
    PackageCheck,
    MapPin,
    ArrowRight
} from 'lucide-react';
import logo from '../../assets/logo.png';

const FTLFormPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [origin, setOrigin] = useState(location.state?.origin || '');
    const [destination, setDestination] = useState(location.state?.destination || '');
    
    // Form States
    const [cargoType, setCargoType] = useState('Machinery');
    const [weight, setWeight] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [specialReqs, setSpecialReqs] = useState({
        fragile: false,
        odc: false,
        hazardous: false,
        tempControlled: false,
        tarpaulin: false
    });
    
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleNextStep = () => {
        if (modalStep < 3) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
                setModalStep(modalStep + 1);
            }, 1000);
        } else {
            setIsModalOpen(false);
            navigate('/booking-summary', { state: { origin, destination, vehicle: selectedTruck } });
        }
    };

    const trucks = [
        { id: 1, name: '14ft Truck', capacity: '3.5 - 4 Tons', bestFor: 'Retail & FMCG', image: '/ftl_truck_delivery_professional_1773813905993.png', desc: 'Ideal for furniture shipments and light goods.' },
        { id: 2, name: '17ft Truck', capacity: '5 Tons', bestFor: 'Industrial Goods', image: '/ptl_parcel_delivery_professional_1773813926389.png', desc: 'Recommended for medium enterprise loads.', bestMatch: true },
        { id: 3, name: '20ft Truck', capacity: '7 - 8 Tons', bestFor: 'E-commerce', image: '/ftl_truck_delivery_professional_1773813905993.png', desc: 'High-capacity solution for distribution networks.' }
    ];

    return (
        <div className="min-h-screen bg-[#FDFBFB] font-sans text-slate-900 selection:bg-red-500 selection:text-white pb-20 overflow-x-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#D28E96]/5 rounded-full blur-[100px] -z-10" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Simplified Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Dot2dotz Logo" className="h-7 w-auto" />
                        <span className="text-lg font-black tracking-tighter">Dot2<span className="text-slate-400 font-bold">dotz</span></span>
                    </div>
                    <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors flex items-center gap-2">
                        <ArrowLeft size={14} /> Go Back
                    </button>
                </div>

                {/* Hero Title Area */}
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full text-[9px] font-black uppercase text-red-600 tracking-[0.2em]">
                        <HelpCircle size={12} /> Optimization Tool
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        Help Me <span className="text-red-600">Choose.</span>
                    </h1>
                    <p className="text-xs font-bold text-slate-400">Specify your load requirements and we'll recommend the optimal vehicle.</p>
                </div>

                {/* Main Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Input Side */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-10 space-y-10">
                            
                            {/* Route Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Origin Pincode</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                            className="w-full pl-12 pr-5 py-4 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-400"
                                            placeholder="Enter pickup"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Destination Pincode</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            className="w-full pl-12 pr-5 py-4 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-400"
                                            placeholder="Enter delivery"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Load Specs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Cargo Type</label>
                                    <div className="relative">
                                        <PackageCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select 
                                            value={cargoType}
                                            onChange={(e) => setCargoType(e.target.value)}
                                            className="w-full pl-12 pr-5 py-4 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option>Machinery</option>
                                            <option>Electronics</option>
                                            <option>FMCG</option>
                                            <option>Textiles</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Total Weight (Tons)</label>
                                    <div className="relative">
                                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="number"
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                            placeholder="Specify weight"
                                            className="w-full pl-12 pr-5 py-4 bg-white border border-slate-300 rounded-lg text-sm font-normal focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Special Reqs Grid */}
                            <div className="space-y-3 pt-6 border-t border-slate-50">
                                <label className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Special Requirements</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        { id: 'fragile', label: 'Fragile' },
                                        { id: 'odc', label: 'Over Dimensioned' },
                                        { id: 'hazardous', label: 'Hazardous' },
                                        { id: 'tempControlled', label: 'Temperature Control' },
                                        { id: 'tarpaulin', label: 'Tarpaulin Req.' }
                                    ].map(req => (
                                        <label key={req.id} className="flex items-center gap-3 bg-[#FDFBFB] border border-slate-200 p-4 rounded-lg cursor-pointer hover:border-red-200 transition-all group">
                                            <input 
                                                type="checkbox" 
                                                checked={specialReqs[req.id]}
                                                onChange={() => setSpecialReqs({ ...specialReqs, [req.id]: !specialReqs[req.id] })}
                                                className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
                                            />
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{req.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations Side */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-red-500">System Result</p>
                            <h3 className="text-xl font-black tracking-tight tracking-tight">Best Deployment</h3>
                        </div>

                        <div className="space-y-4">
                            {trucks.map(truck => (
                                <motion.div
                                    key={truck.id}
                                    whileHover={{ x: 5 }}
                                    onClick={() => setSelectedTruck(truck)}
                                    className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                                        selectedTruck?.id === truck.id 
                                        ? 'bg-white border-red-500 shadow-lg shadow-red-500/5' 
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center p-2 overflow-hidden shrink-0">
                                        <img src={truck.image} alt={truck.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black uppercase text-slate-900">{truck.name}</h4>
                                            {truck.bestMatch && <span className="text-[8px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">Match</span>}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400">Payload: {truck.capacity}</p>
                                        <div className="pt-1">
                                             <p className="text-[7px] font-black uppercase text-slate-300 tracking-widest">BEST FOR</p>
                                             <p className="text-[9px] font-bold text-slate-500">{truck.bestFor}</p>
                                        </div>
                                    </div>
                                    {selectedTruck?.id === truck.id && <CheckCircle2 className="text-red-600" size={16} />}
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary CTA */}
                        <div className="pt-4">
                            <button 
                                onClick={() => {
                                    if (!selectedTruck) {
                                        alert('Please select a recommended truck');
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                className={`w-full py-5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                                    selectedTruck 
                                    ? 'bg-red-600 text-white shadow-xl shadow-red-600/20 hover:bg-slate-900' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Continue To Summary
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-[400px] rounded-2xl p-8 shadow-2xl overflow-hidden" >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"> <X size={20} /> </button>
                            {modalStep === 1 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600"> <Smartphone size={24} /> </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Enter Phone</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification required</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Mobile Number</label>
                                            <input type="tel" placeholder="98XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full px-5 py-4 bg-[#FDFBFB] border border-slate-300 rounded-lg text-lg font-bold focus:outline-none focus:border-red-500 transition-all font-mono" />
                                        </div>
                                        <button onClick={handleNextStep} disabled={phone.length !== 10 || isLoading} className="w-full py-4 bg-slate-900 text-white font-black rounded-lg text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-600 disabled:opacity-50 shadow-xl" >
                                            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Send Code'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {modalStep === 2 && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600"> <CheckCircle2 size={24} /> </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Verify OTP</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sent to +91 {phone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between gap-2"> {otp.map((digit, i) => ( <input key={i} id={`otp-${i}`} type="text" maxLength={1} value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} className="w-full h-12 bg-[#FDFBFB] border border-slate-300 rounded-lg text-center text-xl font-bold focus:outline-none focus:border-red-500 transition-all" /> ))} </div>
                                        <button onClick={handleNextStep} disabled={otp.some(d => !d) || isLoading} className="w-full py-4 bg-red-600 text-white font-black rounded-lg text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-900 disabled:opacity-50 shadow-xl" >
                                            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : 'Verify & Proceed'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {modalStep === 3 && (
                                <div className="space-y-8 py-4 text-center">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto"> <CheckCircle2 size={32} /> </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900 uppercase">Success!</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo verified.</p>
                                    </div>
                                    <button onClick={handleNextStep} className="w-full py-4 bg-slate-900 text-white font-black rounded-lg text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-600" > View Summary </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FTLFormPage;
