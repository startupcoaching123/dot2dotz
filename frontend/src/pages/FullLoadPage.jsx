import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Quote,
  Truck,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Globe2,
  Timer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IMAGE_1 = "/ftl_truck_delivery_professional_1773813905993.png"; 
const IMAGE_2 = "/ptl_parcel_delivery_professional_1773813926389.png"; 

const FullLoadPage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-50 selection:text-red-600 pb-20 overflow-x-hidden">
            {/* Minimal Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

            {/* Header Section */}
            <section className="relative pt-32 pb-24 px-6 sm:px-8 lg:px-20 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 bg-red-50 px-5 py-2 rounded-full">
                        Enterprise Solutions
                    </span>
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight"
                >
                    Full Truck Load <br />
                    <span className="text-red-600 italic">Redefined.</span>
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed"
                >
                    Premium dedicated logistics architecture. We provide a seamless extension 
                    to your supply chain with verified capacity and professional excellence.
                </motion.p>
            </section>

            {/* Image Section - Cleaner Grid */}
            <section className="px-6 sm:px-8 lg:px-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="rounded-3xl overflow-hidden shadow-sm h-[400px] md:h-[500px] border border-slate-100"
                    >
                        <img 
                            src={IMAGE_1} 
                            alt="Logistics Fleet" 
                            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" 
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.1 }}
                        className="rounded-3xl overflow-hidden shadow-sm h-[400px] md:h-[500px] border border-slate-100"
                    >
                        <img 
                            src={IMAGE_2} 
                            alt="Logistics Operations" 
                            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000" 
                        />
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar - More Minimal */}
            <section className="mt-20 px-6 sm:px-8 lg:px-20 border-y border-slate-50 py-12 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: <Timer size={16}/>, label: "Point-to-Point", value: "Dedicated" },
                        { icon: <Globe2 size={16}/>, label: "Regional Reach", value: "Pan-India" },
                        { icon: <ShieldCheck size={16}/>, label: "Security", value: "Full-Seal" },
                        { icon: <Zap size={16}/>, label: "Speed", value: "Priority" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-sm font-black text-slate-900 uppercase italic">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Content Deep Dive */}
            <section className="px-6 sm:px-8 lg:px-20 py-24 max-w-5xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <Quote className="text-red-600/10 w-12 h-12" />
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                        We architect the flow of commerce by eliminating <span className="text-red-600 italic">unnecessary touchpoints</span>. Your cargo moves directly, securely, and with total transparency.
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                        <p>
                            From our hubs in New Delhi, we orchestrate a verified fleet that connects the most vital 
                            industrial zones in India. Our FTL protocol ensures zero transshipment, meaning your goods are never handled 
                            between the point of origin and delivery terminal.
                        </p>
                        <p>
                            Integrated telemetry and real-time dispatch management allow for surgical precision in supply chain 
                            scheduling. Whether you're moving electronics or industrial machinery, our team ensures every 
                            shipment arrives as expected.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link to="/about" className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                            Strategic Journey <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Feature Cards - Minimalist Glass */}
            <section className="px-6 sm:px-8 lg:px-20 mb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Point To Point", desc: "Shortest possible routes with no intermediate handling.", icon: <Truck size={24}/> },
                        { title: "Sealed Transit", desc: "Tamper-proof cargo protocols for high-value priority freight.", icon: <PackageCheck size={24}/> },
                        { icon: <ShieldCheck size={24}/>, title: "Verified Assets", desc: "Every vehicle and driver is meticulously vetted for total safety." }
                    ].map((card, i) => (
                        <div key={i} className="p-10 rounded-[2rem] border border-slate-50 bg-white hover:border-red-100/50 hover:shadow-xl hover:shadow-slate-100/40 transition-all duration-500">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-8 border border-slate-100">
                                {card.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight uppercase italic">{card.title}</h3>
                            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form Section - Clean Tool Interface */}
            <section className="px-6 sm:px-8 lg:px-20">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 md:p-12"
                    >
                        <div className="mb-10">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Query Console</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">dedicated load requisition</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: "Origin Location", placeholder: "Pickup Pincode" },
                                { label: "Target Terminal", placeholder: "Delivery Pincode" }
                            ].map((field, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1 italic">{field.label}</label>
                                    <input 
                                        type="text" 
                                        placeholder={field.placeholder} 
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-red-500 transition-all"
                                    />
                                </div>
                            ))}
                            <div className="flex gap-3 pt-6">
                                <button className="flex-1 py-4 bg-slate-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">
                                    Book Deployment
                                </button>
                                <button className="px-6 py-4 border border-slate-200 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">
                                    Rates
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
                                Trusted by <br />
                                <span className="text-red-600">Enterprise Leaders.</span>
                            </h3>
                            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-sm">
                                Join our network of over 5,000 corporate partners who rely on Dot2dotz 
                                for precision FTL delivery.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {[
                                "Full Transit Cargo Insurance",
                                "24/7 Enterprise Support Desk",
                                "Direct Telemetry Integration"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <CheckCircle2 size={16} className="text-red-600" />
                                    <p className="font-bold text-xs md:text-sm text-slate-700 tracking-tight">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FullLoadPage;



