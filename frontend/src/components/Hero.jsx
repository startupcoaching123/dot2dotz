import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Map, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImg from '../assets/hero.png';
import fullLoadImg from '../assets/full-load.jpeg';
import partLoadImg from '../assets/part-load.jpeg';

const Hero = () => {
    const navigate = useNavigate();
    const [loadType, setLoadType] = useState('FTL');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [hoveredType, setHoveredType] = useState(null);

    const handleGetEstimate = () => {
        if (loadType === 'PTL') {
            navigate('/ptl-estimate');
        }
    };

    const loadDetails = {
        PTL: {
            title: "Part Truck Load (PTL)",
            steps: [
                { title: "1. Enter Pickup & Delivery Pincode", desc: "Provide origin and destination details to check service availability." },
                { title: "2. Add Box / Product Details", desc: "Enter shipment weight (50 kg – 5 tons), number of boxes, dimensions, and goods type." },
                { title: "3. Get Shared Load Estimate", desc: "System calculates cost based on space utilization and route consolidation." },
                { title: "4. Confirm & Make Payment", desc: "Confirm booking and complete payment to schedule pickup and delivery." }
            ]
        },
        FTL: {
            title: "Full Truck Load (FTL)",
            steps: [
                { title: "1. Enter Origin & Destination", desc: "Provide pickup and delivery location details." },
                { title: "2. Add Load Material Details", desc: "Mention total weight (5+ tons or bulk goods), material type, and special handling requirements." },
                { title: "3. Select Truck Type", desc: "Choose suitable vehicle type based on load size (e.g., 14 ft, 17 ft, 32 ft, container, etc.)." },
                { title: "4. Confirm Booking & Payment", desc: "Dedicated truck is assigned after confirmation and payment." }
            ]
        }
    };

    return (
        <div className="relative h-[100vh] flex items-center justify-center overflow-hidden font-sans pt-20">
            {/* Background Image with Overlay and Animation */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.1, y: 0 }}
                    animate={{ scale: 1, y: -20 }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    src={heroImg}
                    alt="Logistics Background"
                    className="w-full h-[110%] object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1440px] px-6 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-16">

                {/* Hero Text Content - Shown on Desktop */}
                <div className="hidden lg:block flex-1 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-[2px] w-12 bg-red-600"></div>
                            <span className="text-red-500 font-black italic tracking-[0.3em] uppercase text-sm">Next-Gen Logistics</span>
                        </div>
                        <h1 className="text-7xl xl:text-8xl font-black text-white italic leading-[0.9] mb-8">
                            MOVING <br />
                            <span className="text-red-600 drop-shadow-2xl">FREIGHT</span> <br />
                            FASTER.
                        </h1>
                        <p className="text-black/70 text-lg font-medium italic max-w-md border-l-4 border-red-600 pl-6 py-2">
                            Revolutionizing the way you ship. Full transparency, real-time tracking, and unmatched reliability.
                        </p>
                    </motion.div>
                </div>

                {/* Booking Widget */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 lg:p-10 w-full max-w-[480px] border border-white/20"
                >
                    {/* Load Type Toggle with Tooltip */}
                    <div className="relative mb-8">
                        <AnimatePresence>
                            {hoveredType && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 right-0 mb-4 z-20 bg-black text-white rounded-2xl p-4 shadow-2xl border border-white/10"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center transform -rotate-3">
                                            <ChevronRight size={14} className="text-white" />
                                        </div>
                                        <h4 className="text-[11px] font-black italic uppercase tracking-wider">
                                            How {hoveredType === 'FTL' ? 'Full' : 'Part'} Load Works
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {loadDetails[hoveredType].steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <div className="flex-shrink-0 w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[8px] font-bold text-red-500 mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-[9px] text-gray-300 font-medium leading-tight">
                                                    {step.title.split('. ')[1] || step.title}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 bg-black border-r border-b border-white/10 rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setLoadType('FTL')}
                                onMouseEnter={() => setHoveredType('FTL')}
                                onMouseLeave={() => setHoveredType(null)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${loadType === 'FTL'
                                    ? 'border-black bg-white ring-2 ring-black/5 shadow-lg'
                                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                                    }`}
                            >
                                <img src={fullLoadImg} alt="FTL" className="w-16 h-8 object-contain" />
                                <div className="text-left">
                                    <span className={`block font-bold text-sm leading-tight ${loadType === 'FTL' ? 'text-black' : 'text-gray-900'}`}>Full Truck Load</span>
                                    <span className="text-[10px] font-bold text-gray-500">FTL</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setLoadType('PTL')}
                                onMouseEnter={() => setHoveredType('PTL')}
                                onMouseLeave={() => setHoveredType(null)}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${loadType === 'PTL'
                                    ? 'border-black bg-white ring-2 ring-black/5 shadow-lg'
                                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                                    }`}
                            >
                                <img src={partLoadImg} alt="PTL" className="w-16 h-8 object-contain" />
                                <div className="text-left">
                                    <span className={`block font-bold text-sm leading-tight ${loadType === 'PTL' ? 'text-black' : 'text-gray-900'}`}>Part Truck Load</span>
                                    <span className="text-[10px] font-bold text-gray-500">PTL</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-6">
                        <div className="space-y-2 group/field">
                            <label className="text-[11px] font-[900] text-black uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-red-600"></span>
                                ORIGIN
                            </label>
                            <div className="relative transform transition-transform duration-300 group-hover/field:translate-x-1">
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="Enter pickup pincode"
                                    className="w-full px-4 py-3 bg-white/50 border-2 border-black rounded-lg text-sm font-bold italic placeholder:not-italic placeholder:text-gray-400 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 group/field">
                            <label className="text-[11px] font-[900] text-black uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-red-600"></span>
                                DESTINATION
                            </label>
                            <div className="relative transform transition-transform duration-300 group-hover/field:translate-x-1">
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter delivery pincode"
                                    className="w-full px-4 py-3 bg-white/50 border-2 border-black rounded-lg text-sm font-bold italic placeholder:not-italic placeholder:text-gray-400 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-10">
                        <button
                            onClick={handleGetEstimate}
                            className="flex-1 bg-[#D98B94] hover:bg-[#C27A83] text-white font-black py-4 px-4 rounded-lg transition-all text-sm italic tracking-widest uppercase transform hover:skew-x-[-6deg] active:scale-95 shadow-[8px_8px_0_rgba(217,139,148,0.2)]"
                        >
                            Get Estimate
                        </button>
                        <button className="flex-1 bg-black hover:bg-gray-900 text-white font-black py-4 px-4 rounded-lg transition-all text-sm italic tracking-widest uppercase transform hover:skew-x-[-6deg] active:scale-95 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                            Book Now
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Floating Partner Tab (Right Edge Overlay) */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[60]">
                <button className="bg-[#BA1122] hover:bg-[#a0101d] text-white py-8 px-2 rounded-l-2xl shadow-2xl transition-all flex items-center justify-center writing-vertical group overflow-hidden">
                    <span className="transform -rotate-180 writing-mode-vertical-rl text-[12px] font-black tracking-[0.3em] uppercase italic group-hover:translate-y-[-4px] transition-transform duration-300">
                        Partner with us
                    </span>
                    <div className="absolute bottom-2 w-1 h-8 bg-white/20 rounded-full overflow-hidden">
                        <div className="w-full h-1/2 bg-white animate-bounce-slow"></div>
                    </div>
                </button>
            </div>

            <style>{`
                .writing-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(-100%); }
                    50% { transform: translateY(100%); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default Hero;
