import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Truck, Box, ShieldCheck, Zap, Globe, ArrowRight } from 'lucide-react';
import heroBg from '../assets/hero1.png';

const Hero = () => {
    const navigate = useNavigate();
    const [loadType, setLoadType] = useState('FTL');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    const handleGetEstimate = (e) => {
        e.preventDefault();
        if (loadType === 'PTL') {
            navigate('/ptl-estimate');
        } else {
            navigate('/services/full-load');
        }
    };

    return (
        <section className="relative min-h-screen md:h-[100vh] lg:min-h-[650px] flex items-center overflow-hidden bg-slate-950 py-20 md:py-0">
            {/* Background Image with Professional Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Logistics Background"
                    className="w-full h-full object-cover scale-105 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-slate-950/95 via-slate-950/80 md:via-slate-950/60 to-slate-900/40"></div>

                {/* Subtle Liquid Glows - Hidden or adjusted on small screens */}
                <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-red-600/10 blur-[80px] md:blur-[100px] rounded-full"></div>
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 md:w-[500px] md:h-[500px] bg-blue-600/10 blur-[100px] md:blur-[120px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-5 sm:px-8 md:px-12 pt-18 lg:px-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">

                    {/* Left Content: Professional Typography */}
                    <div className="w-full lg:w-1/2 space-y-6 md:space-y-10 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4 md:space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mx-auto lg:mx-0">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/80">India's Leading B2B Network</span>
                            </div>

                            <h1 className="text-4xl xs:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight uppercase italic">
                                Smart <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Logistics</span> <br className="hidden sm:block" />
                                Infrastructure
                            </h1>

                            <p className="text-sm md:text-base text-slate-300 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                                Seamlessly connecting freight with verified capacity. We architect the flow of commerce with precision and reliability.
                            </p>

                            {/* Compact Feature Grid */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-md mx-auto lg:mx-0 pt-2">
                                {[
                                    { icon: Zap, label: "Instant Dispatch" },
                                    { icon: ShieldCheck, label: "100% Verified" },
                                    { icon: Globe, label: "Pan-India Reach" },
                                    { icon: Truck, label: "Premium Fleet" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 md:gap-3">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center text-red-500 border border-white/5">
                                            <item.icon size={14} className="md:w-4 md:h-4" />
                                        </div>
                                        <span className="text-[9px] md:text-[11px] font-black text-white/90 uppercase tracking-wider italic">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content: Refined Liquid Glass Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-[420px] max-w-[500px] mx-auto"
                    >
                        <div className="relative bg-white/[0.04] backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/10 shadow-2xl">
                            {/* Form Header */}
                            <div className="mb-6 md:mb-8 pl-1">
                                <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter">Get a Quote</h3>
                                <div className="w-10 h-1 bg-red-600 mt-2 rounded-full"></div>
                            </div>

                            <div className="space-y-6 md:space-y-8">
                                {/* Tab Switcher */}
                                <div className="p-1 bg-white/5 rounded-xl flex gap-1">
                                    {['FTL', 'PTL'].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setLoadType(type)}
                                            className={`flex-1 py-2.5 md:py-3 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all ${loadType === type
                                                ? 'bg-white text-black shadow-lg scale-100'
                                                : 'text-white/40 hover:text-white'
                                                }`}
                                        >
                                            {type === 'FTL' ? 'Full Truck' : 'Part Load'}
                                        </button>
                                    ))}
                                </div>

                                {/* Form Inputs */}
                                <form onSubmit={handleGetEstimate} className="space-y-5 md:space-y-6">
                                    <div className="space-y-4 md:space-y-5 relative">
                                        <div className="absolute left-[9px] top-6 bottom-6 w-[1px] bg-white/10"></div>

                                        <div className="space-y-2 relative z-10">
                                            <label className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 italic">
                                                <div className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center">
                                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full"></div>
                                                </div>
                                                Origin
                                            </label>
                                            <input
                                                type="text"
                                                value={origin}
                                                onChange={(e) => setOrigin(e.target.value)}
                                                placeholder="Enter pickup pincode"
                                                className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white/5 border border-white/5 rounded-xl text-white text-[11px] md:text-xs font-black placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-red-500 transition-all italic tracking-wider ml-1"
                                            />
                                        </div>

                                        <div className="space-y-2 relative z-10">
                                            <label className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3 italic">
                                                <div className="w-4 h-4 rounded-full border border-blue-500 flex items-center justify-center">
                                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full"></div>
                                                </div>
                                                Destination
                                            </label>
                                            <input
                                                type="text"
                                                value={destination}
                                                onChange={(e) => setDestination(e.target.value)}
                                                placeholder="Enter delivery pincode"
                                                className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-white/5 border border-white/5 rounded-xl text-white text-[11px] md:text-xs font-black placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-blue-500 transition-all italic tracking-wider ml-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                                        <button
                                            type="submit"
                                            className="flex-[1.5] py-3.5 md:py-4 bg-white text-black font-black rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest transition-all shadow-xl hover:bg-red-600 hover:text-white flex items-center justify-center gap-2 italic order-1 sm:order-none"
                                        >
                                            Estimate <ArrowRight size={14} />
                                        </button>
                                        <Link
                                            to="/contact"
                                            className="flex-1 py-3.5 md:py-4 bg-white/5 border border-white/10 text-white font-black rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center italic hover:border-white/30"
                                        >
                                            Support
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Vertical CTA - Hidden on Mobile */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
                <button className="bg-black text-white px-2 py-5 rounded-l-xl font-black text-[9px] [writing-mode:vertical-lr] uppercase tracking-[0.2em] border-l border-t border-b border-black hover:bg-gray-900 transition-all flex items-center gap-3 shadow-2xl">
                    Partner with us <ChevronRight size={12} className="rotate-90" />
                </button>
            </div>

            <style>{`
                @keyframes slow-zoom {
                    from { transform: scale(1); }
                    to { transform: scale(1.1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s infinite alternate ease-in-out;
                }
            `}</style>
        </section>
    );
};

export default Hero;

