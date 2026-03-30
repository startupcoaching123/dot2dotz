import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Truck,
    ArrowRight,
    ChevronDown,
    Smartphone,
    CheckCircle2,
    X,
    HelpCircle,
    Package
} from 'lucide-react';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import truckImg from '../../assets/truck2.png';
import logo from '../../assets/logo.png';

const FTLEstimationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const [origin, setOrigin] = useState(location.state?.origin || '');
    const [destination, setDestination] = useState(location.state?.destination || '');
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.VEHICLES}`);
                const data = await response.json();
                const vehiclesList = Array.isArray(data) ? data : (data.vehicles || []);

                if (vehiclesList.length > 0) {
                    setVehicles(vehiclesList);
                } else {
                    throw new Error('No vehicles found');
                }
            } catch (error) {
                console.error('Error fetching vehicles, using mock data:', error);
                const mockVehicles = [
                    { id: 1, name: '14ft Truck', capacity: '3.5 - 4 Tons', bestFor: 'Retail & FMCG', image: '/ftl_truck_delivery_professional_1773813905993.png' },
                    { id: 2, name: '17ft Truck', capacity: '5 Tons', bestFor: 'Industrial Goods', image: '/ptl_parcel_delivery_professional_1773813926389.png' },
                    { id: 3, name: '20ft Truck', capacity: '7 - 8 Tons', bestFor: 'E-commerce', image: '/ftl_truck_delivery_professional_1773813905993.png' },
                    { id: 4, name: '24ft Truck', capacity: '10 Tons', bestFor: 'Heavy Machinery', image: '/ptl_parcel_delivery_professional_1773813926389.png' },
                    { id: 5, name: '32ft Container', capacity: '15 Tons', bestFor: 'Export/Import', image: '/ftl_truck_delivery_professional_1773813905993.png' },
                ];
                setVehicles(mockVehicles);
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
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6">


                {/* Professional Hero Banner */}
                <div className="relative bg-slate-900 rounded-3xl overflow-hidden min-h-[220px] flex flex-col md:flex-row items-center shadow-lg">
                    <div className="flex-1 p-8 md:p-12 space-y-4 z-10">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm border border-white/10">
                            <Truck size={14} /> FTL Solutions
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                Book Your Full Truck Load
                            </h1>
                            <p className="text-sm font-medium text-slate-400 max-w-md">
                                Get instant estimates and book reliable pan-India shipments tailored to your business needs.
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-[45%] h-48 md:h-[240px] flex items-center justify-center overflow-hidden">
                        {/* Decorative Background for Image */}
                        <div className="absolute inset-0 bg-gradient-to-l from-slate-800 to-transparent" />
                        <motion.img
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            src={truckImg}
                            alt="Logistics Truck"
                            className="relative z-10 w-[70%] md:w-[85%] h-auto object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>

                {/* Main Form Section */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Origin Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Origin Pincode</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="Enter pickup pincode"
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Destination Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Destination Pincode</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter delivery pincode"
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Truck Selection Dropdown & Help */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700">Select Truck Category</label>
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className="relative w-full md:flex-[2]">
                                    <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <select
                                        className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all appearance-none cursor-pointer"
                                        value={selectedVehicle?.id || ''}
                                        onChange={(e) => {
                                            const v = vehicles.find(v => v.id === parseInt(e.target.value));
                                            if (v) setSelectedVehicle(v);
                                        }}
                                    >
                                        <option value="" disabled>Select vehicle type...</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>{v.name} ({v.capacity})</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>

                                <button
                                    onClick={() => navigate('/services/full-load-form', { state: { origin, destination } })}
                                    className="w-full md:w-auto px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <HelpCircle size={16} />
                                    Help me choose
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Vehicle Cards List */}
                    <div className="space-y-3 pt-2">
                        <label className="block text-sm font-medium text-slate-700">Or Select From Popular Options</label>
                        <div className="relative group">
                            <div
                                ref={scrollContainerRef}
                                className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x pt-2"
                            >
                                {vehicles.map((truck) => {
                                    const isSelected = selectedVehicle?.id === truck.id;
                                    return (
                                        <motion.div
                                            key={truck.id}
                                            whileHover={{ y: -4 }}
                                            onClick={() => setSelectedVehicle(truck)}
                                            className={`min-w-[180px] p-4 rounded-2xl border-2 transition-all cursor-pointer snap-start flex flex-col gap-3 ${isSelected
                                                ? 'border-slate-900 bg-slate-50'
                                                : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                                                }`}
                                        >
                                            <div className="h-24 bg-white rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden p-3 relative">
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 text-slate-900">
                                                        <CheckCircle2 size={16} className="fill-slate-900 text-white" />
                                                    </div>
                                                )}
                                                <img src={truck.image || '/truck_placeholder.png'} alt={truck.name} className="h-full object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{truck.name}</h4>
                                                <p className="text-xs font-medium text-slate-500 mt-0.5">Capacity: {truck.capacity}</p>
                                            </div>
                                            <div className="mt-auto pt-2">
                                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md inline-flex items-center gap-1.5">
                                                    <Package size={12} />
                                                    {truck.bestFor}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <button
                            onClick={() => {
                                if (!selectedVehicle) {
                                    alert('Please select a truck type');
                                    return;
                                }
                                setIsModalOpen(true);
                            }}
                            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all ${selectedVehicle
                                ? 'bg-red-600 text-white hover:bg-slate-800 shadow-sm hover:shadow active:scale-95'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Get Estimate
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Verification Modal (Refined UX) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-md rounded-2xl p-8 shadow-xl border border-slate-100 overflow-hidden z-10"
                        >
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 hover:bg-slate-50 p-1.5 rounded-full transition-colors">
                                <X size={20} />
                            </button>

                            {modalStep === 1 && (
                                <div className="space-y-8 pt-2">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-4">
                                            <Smartphone size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Verify Identity</h3>
                                        <p className="text-sm text-slate-500">Please enter your mobile number to get a personalized quote.</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">+91</span>
                                                <input
                                                    type="tel"
                                                    placeholder="90000 00000"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-base font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:font-normal placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={phone.length !== 10 || isLoading}
                                            className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm transition-all hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center h-12"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin"></div>
                                            ) : 'Send Security Code'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalStep === 2 && (
                                <div className="space-y-8 pt-2">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-700 mx-auto mb-4">
                                            <Smartphone size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">Enter Security Code</h3>
                                        <p className="text-sm text-slate-500">We've sent a 6-digit code to <span className="font-medium text-slate-900">+91 {phone}</span></p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between gap-2">
                                            {otp.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    id={`otp-${i}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                                    className="w-12 h-14 bg-white border border-slate-200 rounded-xl text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                                                />
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={otp.some(d => !d) || isLoading}
                                            className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl text-sm transition-all hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center h-12"
                                        >
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            ) : 'Verify & Proceed'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalStep === 3 && (
                                <div className="space-y-6 py-4 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900">Verification Complete</h3>
                                        <p className="text-sm text-slate-500">Your identity has been verified. Generating your personalized logistics quote...</p>
                                    </div>
                                    <button
                                        onClick={handleNextStep}
                                        className="w-full py-3 mt-2 bg-slate-900 text-white font-semibold rounded-xl text-sm transition-all hover:bg-slate-800"
                                    >
                                        View Estimate Summary
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