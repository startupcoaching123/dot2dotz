import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  MapPin,
  Truck,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  Globe2,
  Timer,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import truckImg from '../../assets/truck2.png';
import logo from '../../assets/logo.png';

const FullLoadPage = () => {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    const handleGetEstimate = (e) => {
        e.preventDefault();
        navigate('/ftl-estimate', { state: { origin, destination } });
    };

    return (
        <div className="min-h-screen bg-[#FDFBFB] text-slate-900 font-sans selection:bg-red-500 selection:text-white overflow-x-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#D28E96]/5 rounded-full blur-[120px] -z-10" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] -z-10" />

            {/* Premium Header/Nav Placeholder */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex justify-between items-center border-b border-slate-100/50">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Dot2dotz Logo" className="h-7 w-auto" />
                    <span className="text-lg font-black tracking-tighter">Dot2<span className="text-slate-400 font-bold">dotz</span></span>
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    {['Solutions', 'Network', 'Rates', 'Support'].map(item => (
                        <button key={item} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-600 transition-colors">
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Hero Section */}
            <section className="relative px-6 lg:px-8 py-12 md:py-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 bg-red-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-red-600 tracking-widest"
                        >
                            <Zap size={12} /> Direct Enterprise Logistics
                        </motion.div>
                        
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
                        >
                            Precision <span className="text-red-500">Full Truck</span> <br /> 
                            Load Architecture.
                        </motion.h1>
                        
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-base text-slate-500 max-w-lg leading-relaxed font-medium"
                        >
                            Eliminate transshipment delays with our dedicated point-to-point 
                            FTL protocol. Verified capacity, real-time telemetry, and professional 
                            excellence for your enterprise cargo.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to="/ftl-estimate" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 group shadow-xl shadow-slate-900/10">
                                Get Started <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="bg-white border border-slate-200 text-slate-400 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">
                                Watch Insights
                            </button>
                        </motion.div>
                    </div>

                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10 rounded-[3rem] overflow-hidden bg-white/50 backdrop-blur-sm border border-white shadow-2xl"
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
                             <img 
                                src={truckImg} 
                                alt="Modern Fleet" 
                                className="w-full h-auto object-cover transform scale-110 -rotate-2" 
                             />
                        </motion.div>
                        {/* Decorative Shape */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#D28E96]/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </section>

            {/* Quick Estimate Console */}
            <section className="px-6 lg:px-8 py-20 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#FDFBFB] p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-end">
                            <div className="space-y-3">
                                <h3 className="text-2xl font-black tracking-tight text-slate-900">Query Console</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dedicated Load Requisition</p>
                            </div>
                            
                            <form onSubmit={handleGetEstimate} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Origin Pincode</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input 
                                            type="text"
                                            value={origin}
                                            onChange={(e) => setOrigin(e.target.value)}
                                            placeholder="Pick-up"
                                            className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Target Terminal</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                        <input 
                                            type="text"
                                            value={destination}
                                            onChange={(e) => setDestination(e.target.value)}
                                            placeholder="Delivery"
                                            className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <button className="h-[52px] mt-auto bg-red-600 text-white font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-red-600/20">
                                    Check Deployment Rates
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature System */}
            <section className="px-6 lg:px-8 py-32">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                                Engineered for <br />
                                <span className="text-red-500 italic">Uninterrupted Velocity.</span>
                            </h2>
                            <p className="text-slate-500 font-medium max-w-lg">
                                We've re-engineered the logistics lifecycle to prioritize direct movement 
                                and total transparency.
                            </p>
                        </div>
                        <Link to="/ftl-estimate" className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-white transition-all">
                            Explore Services
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Point To Point", desc: "Shortest possible routes with zero intermediate handling or transshipment.", icon: <Truck size={24}/> },
                            { title: "Sealed Transit", desc: "Tamper-proof cargo protocols specifically designed for high-value priority freight.", icon: <PackageCheck size={24}/> },
                            { title: "Verified Assets", desc: "Every vehicle and driver in our dedicated fleet is meticulously vetted for safety.", icon: <ShieldCheck size={24}/> }
                        ].map((card, i) => (
                            <motion.div 
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-10 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-8">
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-black tracking-tight text-slate-900 mb-4">{card.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Stats */}
            <section className="px-6 lg:px-8 pb-32">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 py-16 border-t border-slate-100">
                    {[
                        { label: "Fleet Ready", value: "2,500+" },
                        { label: "Pincodes Covered", value: "19,000+" },
                        { label: "Enterprise Users", value: "500+" },
                        { label: "On-Time Ratio", value: "98.8%" }
                    ].map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default FullLoadPage;
