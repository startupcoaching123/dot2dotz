import React, { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImg from '../assets/hero.png';
import fullLoadImg from '../assets/full-load.jpeg';
import partLoadImg from '../assets/part-load.jpeg';

const Hero = () => {
    const [loadType, setLoadType] = useState('FTL');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [hoveredType, setHoveredType] = useState(null);

    const handleGetEstimate = () => {
        if (loadType === 'PTL') {
            // navigate('/ptl-estimate');
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
        <div className="relative min-h-screen sm:h-screen flex items-center justify-center overflow-hidden font-sans pt-16 sm:pt-20 md:pt-0 pb-8 sm:pb-0">
            {/* Background Image with Overlay and Animation */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    initial={{ scale: 1.1, y: 0 }}
                    animate={{ scale: 1, y: -20 }}
                    transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    src={heroImg}
                    alt="Logistics Background"
                    className="w-full h-full object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 lg:gap-16">

                {/* Hero Text Content - Responsive for all screens */}
                <div className="w-full lg:flex-1 mb-6 sm:mb-8 md:mb-0 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-6 justify-center lg:justify-start">
                            <div className="h-[2px] w-6 sm:w-8 md:w-10 lg:w-12 bg-red-600"></div>
                            <span className="text-red-500 font-black italic tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[10px] sm:text-xs md:text-sm">Next-Gen Logistics</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white italic leading-tight sm:leading-tight md:leading-[1.1] lg:leading-[0.95] xl:leading-[0.9] mb-4 sm:mb-6 md:mb-8">
                            MOVING <br className="block" />
                            <span className="text-red-600 drop-shadow-2xl">FREIGHT</span> <br className="block" />
                            FASTER.
                        </h1>
                        <p className="text-gray-200 text-xs sm:text-sm md:text-base lg:text-lg font-medium italic max-w-xs sm:max-w-sm md:max-w-md border-l-4 border-red-600 pl-3 sm:pl-4 md:pl-6 py-2 mx-auto lg:mx-0">
                            Revolutionizing the way you ship. Full transparency, real-time tracking, and unmatched reliability.
                        </p>
                    </motion.div>
                </div>

                {/* Booking Widget - Responsive */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/90 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[480px] border border-white/20"
                >
                    {/* Load Type Toggle with Tooltip */}
                    <div className="relative mb-6 sm:mb-8">
                        <AnimatePresence>
                            {hoveredType && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 right-0 mb-3 sm:mb-4 z-20 bg-black text-white rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/10"
                                >
                                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                        <div className="w-5 sm:w-6 h-5 sm:h-6 bg-red-600 rounded flex items-center justify-center transform -rotate-3">
                                            <ChevronRight size={12} className="text-white sm:w-4 sm:h-4" />
                                        </div>
                                        <h4 className="text-[9px] sm:text-[10px] md:text-xs font-black italic uppercase tracking-wider">
                                            How {hoveredType === 'FTL' ? 'Full' : 'Part'} Load Works
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        {loadDetails[hoveredType].steps.map((step, idx) => (
                                            <div key={idx} className="flex gap-1.5 sm:gap-2">
                                                <div className="flex-shrink-0 w-3 sm:w-4 h-3 sm:h-4 rounded-full border border-red-500 flex items-center justify-center text-[6px] sm:text-[7px] md:text-[8px] font-bold text-red-500 mt-0.5">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-[8px] sm:text-[9px] text-gray-300 font-medium leading-tight">
                                                    {step.title.split('. ')[1] || step.title}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 sm:w-3 h-2.5 sm:h-3 bg-black border-r border-b border-white/10 rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            <button
                                onClick={() => setLoadType('FTL')}
                                onMouseEnter={() => setHoveredType('FTL')}
                                onMouseLeave={() => setHoveredType(null)}
                                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${loadType === 'FTL'
                                    ? 'border-black bg-white ring-2 ring-black/5 shadow-lg'
                                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                                    }`}
                            >
                                <img src={fullLoadImg} alt="FTL" className="w-12 sm:w-14 md:w-16 h-6 sm:h-7 md:h-8 object-contain" />
                                <div className="text-left hidden sm:block">
                                    <span className={`block font-bold text-xs sm:text-sm leading-tight ${loadType === 'FTL' ? 'text-black' : 'text-gray-900'}`}>Full Truck Load</span>
                                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">FTL</span>
                                </div>
                                <div className="text-left block sm:hidden">
                                    <span className={`block font-bold text-xs leading-tight ${loadType === 'FTL' ? 'text-black' : 'text-gray-900'}`}>FTL</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setLoadType('PTL')}
                                onMouseEnter={() => setHoveredType('PTL')}
                                onMouseLeave={() => setHoveredType(null)}
                                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${loadType === 'PTL'
                                    ? 'border-black bg-white ring-2 ring-black/5 shadow-lg'
                                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                                    }`}
                            >
                                <img src={partLoadImg} alt="PTL" className="w-12 sm:w-14 md:w-16 h-6 sm:h-7 md:h-8 object-contain" />
                                <div className="text-left hidden sm:block">
                                    <span className={`block font-bold text-xs sm:text-sm leading-tight ${loadType === 'PTL' ? 'text-black' : 'text-gray-900'}`}>Part Truck Load</span>
                                    <span className="text-[8px] sm:text-[10px] font-bold text-gray-500">PTL</span>
                                </div>
                                <div className="text-left block sm:hidden">
                                    <span className={`block font-bold text-xs leading-tight ${loadType === 'PTL' ? 'text-black' : 'text-gray-900'}`}>PTL</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4 sm:space-y-5 md:space-y-6">
                        <div className="space-y-1.5 sm:space-y-2 group/field">
                            <label className="text-[9px] sm:text-[10px] md:text-[11px] font-[900] text-black uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                <span className="w-3 sm:w-4 h-[1px] bg-red-600"></span>
                                ORIGIN
                            </label>
                            <div className="relative transform transition-transform duration-300 group-hover/field:translate-x-1">
                                <input
                                    type="text"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                    placeholder="Enter pickup pincode"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border-2 border-black rounded-lg text-xs sm:text-sm font-bold italic placeholder:not-italic placeholder:text-gray-400 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 sm:space-y-2 group/field">
                            <label className="text-[9px] sm:text-[10px] md:text-[11px] font-[900] text-black uppercase tracking-widest ml-1 italic flex items-center gap-2">
                                <span className="w-3 sm:w-4 h-[1px] bg-red-600"></span>
                                DESTINATION
                            </label>
                            <div className="relative transform transition-transform duration-300 group-hover/field:translate-x-1">
                                <input
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="Enter delivery pincode"
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/50 border-2 border-black rounded-lg text-xs sm:text-sm font-bold italic placeholder:not-italic placeholder:text-gray-400 focus:outline-none focus:border-red-600 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
                        <button
                            onClick={handleGetEstimate}
                            className="flex-1 bg-[#D98B94] hover:bg-[#C27A83] text-white font-black py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm italic tracking-widest uppercase transform hover:skew-x-[-6deg] active:scale-95 shadow-[8px_8px_0_rgba(217,139,148,0.2)]"
                        >
                            Get Estimate
                        </button>
                        <button className="flex-1 bg-black hover:bg-gray-900 text-white font-black py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm italic tracking-widest uppercase transform hover:skew-x-[-6deg] active:scale-95 shadow-[8px_8px_0_rgba(0,0,0,0.1)]">
                            Book Now
                        </button>
                    </div>
                </motion.div>
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
