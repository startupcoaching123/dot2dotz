import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MapPin, 
    Truck, 
    ArrowRight, 
    ChevronRight, 
    Smartphone, 
    CheckCircle2, 
    X,
    Info,
    ArrowLeft
} from 'lucide-react';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../api/endpoints';

const FTLEstimationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [origin, setOrigin] = useState(location.state?.origin || '');
    const [destination, setDestination] = useState(location.state?.destination || '');
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.VEHICLES}`);
                const data = await response.json();
                
                // Handle different response formats (array vs object with vehicles key)
                const vehiclesList = Array.isArray(data) ? data : (data.vehicles || []);
                
                if (vehiclesList.length > 0) {
                    setVehicles(vehiclesList);
                } else {
                    throw new Error('No vehicles found');
                }
            } catch (error) {
                console.error('Error fetching vehicles, using mock data:', error);
                // Mock data using actual public assets found in the codebase
                setVehicles([
                    { id: 1, name: '14ft Truck', capacity: '3.5 - 4 Tons', bestFor: 'Retail & FMCG', image: '/ftl_truck_delivery_professional_1773813905993.png' },
                    { id: 2, name: '17ft Truck', capacity: '5 Tons', bestFor: 'Industrial Goods', image: '/ptl_parcel_delivery_professional_1773813926389.png' },
                    { id: 3, name: '20ft Truck', capacity: '7 - 8 Tons', bestFor: 'E-commerce', image: '/ftl_truck_delivery_professional_1773813905993.png' },
                    { id: 4, name: '24ft Truck', capacity: '10 Tons', bestFor: 'Heavy Machinery', image: '/ptl_parcel_delivery_professional_1773813926389.png' },
                    { id: 5, name: '32ft Container', capacity: '15 Tons', bestFor: 'Export/Import', image: '/ftl_truck_delivery_professional_1773813905993.png' },
                ]);
            }
        };
        fetchVehicles();
    }, []);

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
            navigate('/booking-summary', { state: { origin, destination, vehicle: selectedVehicle } });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4 md:px-8 font-sans selection:bg-red-600 selection:text-white overflow-x-hidden">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header/Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-all"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8 md:p-12">
                    <div className="space-y-12">
                        
                        {/* Route Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Origin</label>
                                <div className="relative group">
                                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" />
                                    <input 
                                        type="text" 
                                        value={origin}
                                        onChange={(e) => setOrigin(e.target.value)}
                                        placeholder="Enter pickup pincode" 
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:bg-white focus:border-red-500 transition-all italic"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 italic">Destination</label>
                                <div className="relative group">
                                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" />
                                    <input 
                                        type="text" 
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        placeholder="Enter delivery pincode" 
                                        className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:bg-white focus:border-red-500 transition-all italic"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Truck Selection Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                                <h3 className="text-sm font-black uppercase text-slate-900 italic tracking-tight">Truck type</h3>
                                <div className="w-12 h-1 bg-red-600 rounded-full mx-auto sm:mx-0"></div>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/services/full-load-form', { state: { origin, destination } })}
                                className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-red-200 hover:text-red-600 transition-all shadow-sm"
                            >
                                Not Sure Which Truck To Choose? <span className="text-red-600">Let us help</span>
                            </button>
                        </div>

                        {/* Horizontal Vehicle List */}
                        <div className="relative -mx-8 md:-mx-12 px-8 md:px-12">
                            <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar snap-x">
                                {vehicles.length > 0 ? vehicles.map((truck) => (
                                    <motion.div 
                                        key={truck.id}
                                        whileHover={{ y: -5 }}
                                        onClick={() => setSelectedVehicle(truck)}
                                        className={`min-w-[280px] p-6 rounded-3xl border transition-all cursor-pointer snap-start flex flex-col gap-4 ${selectedVehicle?.id === truck.id ? 'border-red-500 bg-red-50/30' : 'border-slate-100 bg-white hover:border-red-100 shadow-sm'}`}
                                    >
                                        <div className="h-32 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                                            <img src={truck.image || '/truck_placeholder.png'} alt={truck.name} className="h-24 object-contain" />
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900">{truck.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capacity: {truck.capacity}</p>
                                            </div>
                                            <div className="p-3 bg-white/50 border border-slate-50 rounded-xl">
                                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Best For</p>
                                                <p className="text-[10px] font-bold text-slate-900 italic">{truck.bestFor}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    // Skeletons
                                    [1, 2, 3, 4].map(i => (
                                        <div key={i} className="min-w-[280px] h-[280px] bg-slate-50 animate-pulse rounded-3xl border border-slate-100"></div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex justify-end pt-4">
                            <button 
                                onClick={() => {
                                    if (!selectedVehicle) {
                                        alert('Please select a truck type');
                                        return;
                                    }
                                    setIsModalOpen(true);
                                }}
                                className="group w-full md:w-64 py-5 bg-red-500 hover:bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 italic"
                            >
                                Get Estimate 
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-[440px] rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
                                <X size={24} />
                            </button>

                            {modalStep === 1 && (
                                <div className="space-y-10 py-4">
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                            <Smartphone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">Enter Phone</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Verification required for quote</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mobile Number</label>
                                            <input 
                                                type="tel" 
                                                placeholder="98XXXXXXXX" 
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-bold focus:outline-none focus:bg-white focus:border-red-500 transition-all tracking-widest"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleNextStep}
                                            disabled={phone.length !== 10 || isLoading}
                                            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-slate-900 shadow-xl overflow-hidden relative group"
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            ) : 'Send Security Code'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-10 py-4">
                                    <div className="space-y-3">
                                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">Verify OTP</h3>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Code sent to +91 {phone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-8 text-center">
                                        <div className="flex justify-between gap-2">
                                            {otp.map((digit, i) => (
                                                <input 
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-red-500 transition-all"
                                                />
                                            ))}
                                        </div>
                                        <button 
                                            onClick={handleNextStep}
                                            disabled={otp.some(d => !d) || isLoading}
                                            className="w-full py-5 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-slate-900 disabled:opacity-50 disabled:hover:bg-red-600 shadow-xl"
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            ) : 'Verify & Proceed'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="space-y-8 py-8 items-center text-center flex flex-col">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">Success!</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification complete. Generating quote...</p>
                                    </div>
                                    <button 
                                        onClick={handleNextStep}
                                        className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-600 shadow-xl"
                                    >
                                        View Summary
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default FTLEstimationPage;
