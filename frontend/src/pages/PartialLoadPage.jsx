import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Quote,
  Box,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  Zap,
  Layers,
  BarChart3,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IMAGE_1 = "/ptl_parcel_delivery_professional_1773813926389.png"; 
const IMAGE_2 = "/ftl_truck_delivery_professional_1773813905993.png"; 

const PartialLoadPage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-50 selection:text-red-600 pb-20 overflow-x-hidden">
            {/* Very Subtle Grid Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

            {/* Header Section */}
            <section className="relative pt-32 pb-24 px-6 sm:px-8 lg:px-20 z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6"
                        >
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600 bg-red-50 px-5 py-2 rounded-full">
                                Smart Consolidation
                            </span>
                        </motion.div>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight"
                        >
                            Part Load <br />
                            <span className="text-red-600 italic">Agility.</span>
                        </motion.h1>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="lg:pb-2"
                    >
                        <p className="text-sm md:text-base text-slate-500 max-w-md leading-relaxed font-medium border-l border-red-200 pl-6">
                            Optimize your supply chain by paying only for the space you occupy. 
                            Our PTL systems deliver full-truck reliability for smaller payloads with daily departures.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Image Gallery - More Refined Spacing */}
            <section className="px-6 sm:px-8 lg:px-20 mb-32 relative z-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="md:w-3/5 rounded-3xl overflow-hidden shadow-sm h-[350px] md:h-[500px] border border-slate-100"
                    >
                        <img 
                            src={IMAGE_1} 
                            alt="PTL Logistics" 
                            className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-1000" 
                        />
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="md:w-2/5 rounded-3xl overflow-hidden shadow-sm h-[250px] md:h-[400px] md:mt-24 border border-slate-100"
                    >
                        <img 
                            src={IMAGE_2} 
                            alt="Network Density" 
                            className="w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-all duration-1000" 
                        />
                    </motion.div>
                </div>
            </section>

            {/* Performance Stats - Minimalist Layout */}
            <section className="px-6 sm:px-8 lg:px-20 mb-32 border-y border-slate-50 py-16 bg-slate-50/20">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    {[
                        { label: "Coverage", value: "98%", sub: "Pan-India" },
                        { label: "Dispatch", value: "99.2%", sub: "On-Time" },
                        { label: "Savings", value: "45%", sub: "Avg. vs FTL" },
                        { label: "Safety", value: "100%", sub: "Verified" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
                            <h4 className="text-2xl md:text-3xl font-black italic text-slate-900 tracking-tighter mb-1">{stat.value}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Content Deep Dive */}
            <section className="px-6 sm:px-8 lg:px-20 mb-32 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10"
                >
                    <Quote className="text-slate-100 w-16 h-16" />
                    
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                        We bridge the gap for shipments that are <span className="text-red-600 block sm:inline italic">larger than a parcel </span> 
                         but don't require a full fleet. Our PTL solutions use intelligent 
                        consolidation to maintain speed while lowering overheads.
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                        <p>
                            Dot2dotz utilizes a hub-and-spoke model that minimizes dwell time. By 
                            aggregating multiple partial loads onto optimized transit lanes, we 
                            provide business-class logistics at a fraction of the cost.
                        </p>
                        <p>
                            Our PTL clients enjoy the same real-time visibility and transit protection 
                            as our dedicated fleet partners. From industrial components to retail 
                            inventories, we move your business with surgical precision.
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link to="/about" className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                            Efficiency Report <ArrowRight size={14} />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Service Cards - Clean White Cards */}
            <section className="px-6 sm:px-8 lg:px-20 mb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Volumetric Scaling", desc: "Pay precisely for the cubic volume your cargo occupies in our network.", icon: <Scale size={20}/> },
                        { title: "Direct Hub Link", desc: "Minimal transit touchpoints between origin and destination hubs.", icon: <Layers size={20}/> },
                        { title: "Lane Intelligence", desc: "Real-time route optimization to ensure the fastest possible consolidation.", icon: <BarChart3 size={20}/> }
                    ].map((card, i) => (
                        <div key={i} className="bg-white p-10 rounded-3xl border border-slate-50 hover:border-red-100/50 hover:shadow-xl hover:shadow-slate-100/40 transition-all duration-500 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-red-50 group-hover:text-red-600 transition-all">
                                {card.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-3 tracking-tight uppercase italic">{card.title}</h3>
                            <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PTL Console - Clean & Functional */}
            <section className="px-6 sm:px-8 lg:px-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Console Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-5 mb-12 border-b border-white/10 pb-8">
                                <div className="w-12 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                                    <Box className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none">PTL Console</h3>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mt-2">calculate shared space</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: "Consignment Origin", placeholder: "Pickup Location" },
                                    { label: "Consignment Target", placeholder: "Delivery Terminal" }
                                ].map((field, i) => (
                                    <div key={i} className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-white/30 ml-1 italic">{field.label}</label>
                                        <input 
                                            type="text" 
                                            placeholder={field.placeholder} 
                                            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-white/10"
                                        />
                                    </div>
                                ))}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
                                    <button className="py-4 bg-red-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-red-600 transition-all flex items-center justify-center gap-2">
                                        Secure Booking <ArrowRight size={14} />
                                    </button>
                                    <button className="py-4 bg-white/5 border border-white/10 text-white/40 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:text-white transition-all">
                                        Estimates
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Premium Value List */}
                    <div className="space-y-10 lg:pl-10">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-tight">
                                Scale Smarter. <br />
                                <span className="text-red-600">Ship Faster.</span>
                            </h3>
                            <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-md">
                                Leverage our Pan-India PTL network to reduce costs without compromising on transit speed or safety.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {[
                                { title: "Daily Lane Departures", icon: <Zap size={16}/> },
                                { title: "Secure Cargo Protection", icon: <ShieldCheck size={16}/> },
                                { title: "Real-time GPS Tracking", icon: <Globe size={16}/> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <p className="font-bold text-slate-800 text-xs md:text-sm italic uppercase tracking-wide">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartialLoadPage;
