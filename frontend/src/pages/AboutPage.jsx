import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Headphones, CheckCircle2, Globe, Building2, Phone, Mail, MapPin, ArrowRight, Star } from 'lucide-react';
import transportImg from '../assets/transport.png';

const AboutPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const differentiators = [
        {
            icon: Truck,
            title: "Expert Drivers",
            desc: "Our drivers are our biggest asset. Experienced, qualified, and familiar with the routes, they ensure on-time delivery in excellent condition."
        },
        {
            icon: Globe,
            title: "Large Fleet",
            desc: "A massive and varied fleet of trucks catering to every requirement, from light commercial vehicles to heavy-duty trailers."
        },
        {
            icon: Shield,
            title: "Competitive Pricing",
            desc: "Transparent and affordable rates without compromising on quality or service excellence. We provide the best value in the market."
        },
        {
            icon: Headphones,
            title: "24/7 Support",
            desc: "Dedicated customer service available round the clock. Real-time truck tracking and live updates for a stress-free experience."
        }
    ];

    const corporateInfos = [
        {
            name: "Dattar Solutions Pvt. Ltd.",
            gst: "07AAFCD7072F1ZO",
            cin: "U74999DL2016PTC298482"
        },
        {
            name: "DATTAR EXPRESS PVT.LTD.",
            gst: "07AAJCD3397F1ZG",
            cin: "U60222DL2022PTC399725",
            specialty: "FULL LOAD / PART LOAD / PARCEL / HOUSE HOLD"
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-red-600 selection:text-white pt-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Logistics"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-[1000] italic text-white leading-none tracking-tighter mb-6 uppercase">
                            OUR <span className="text-red-600">MISSION</span>
                        </h1>
                        <p className="text-white/60 text-xl font-medium tracking-[0.2em] italic uppercase">Innovation meets Logistics</p>
                    </motion.div>
                </div>

                {/* Animated Speed Lines */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
                {/* Introduction */}
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[2px] w-12 bg-red-600"></div>
                            <span className="text-red-600 font-black italic tracking-[0.3em] uppercase text-sm">About Dot2Dotz</span>
                        </div>
                        <h2 className="text-5xl font-black italic text-black leading-[1.1] mb-8">
                            Empowering India's <br />
                            <span className="text-red-600">Movements since 2016.</span>
                        </h2>
                        <p className="text-xl text-gray-600 font-medium leading-relaxed mb-6 italic border-l-4 border-red-600 pl-8">
                            Dot2dotz is an online transport service that offers a hassle-free way to all your transport needs/requirements. We are a Delhi-based online transport booking company, and our services are operational in all major cities across India.
                        </p>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            Since our establishment in mid-2016, we have been striving to provide the best possible online truck booking experience. We believe in offering transparent and affordable rates, quick and easy booking process, and excellent customer service.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-gray-100 rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Warehouse"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 bg-red-600 text-white p-12 rounded-[2rem] shadow-2xl -rotate-6">
                            <h3 className="text-5xl font-[1000] italic">9+</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-red-100 italic">Years of Excellence</p>
                        </div>
                    </motion.div>
                </div>

                {/* Legacy & Vision Cards */}
                <div className="grid md:grid-cols-2 gap-10 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-black p-12 lg:p-16 rounded-[4rem] text-white overflow-hidden relative group"
                    >
                        <Star className="absolute -right-10 -top-10 w-40 h-40 text-white/5 group-hover:rotate-45 transition-transform duration-700" />
                        <h3 className="text-3xl font-black italic text-red-600 uppercase mb-6 tracking-wider">Our Philosophy</h3>
                        <p className="text-white/70 text-lg font-medium leading-relaxed italic">
                            "We understand that not everyone is familiar with booking a truck, so we have made our platform as simple as possible. No more visiting multiple agencies—everything you need is right here."
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-50 p-12 lg:p-16 rounded-[4rem] text-black overflow-hidden relative group border border-gray-100"
                    >
                        <Globe className="absolute -right-10 -top-10 w-40 h-40 text-black/5 group-hover:-rotate-45 transition-transform duration-700" />
                        <h3 className="text-3xl font-black italic text-black uppercase mb-6 tracking-wider">The Vision</h3>
                        <p className="text-gray-500 text-lg font-medium leading-relaxed italic">
                            "To build a transport ecosystem that is both affordable and reliable. We have a wide range of trucks with different capacities to ensure every shipment finds its perfect vehicle."
                        </p>
                    </motion.div>
                </div>

                {/* Differentiators */}
                <div className="mb-32">
                    <div className="mb-16 text-center">
                        <h2 className="text-5xl font-black italic text-black uppercase tracking-tight mb-4">
                            What Makes Us <span className="text-red-600">Different?</span>
                        </h2>
                        <div className="h-1.5 w-32 bg-red-600 mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {differentiators.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 bg-white border border-gray-100 rounded-[3rem] hover:border-red-600 hover:shadow-2xl transition-all group text-center lg:text-left"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-600 transition-colors mx-auto lg:ml-0">
                                    <item.icon className="text-red-600 group-hover:text-white transition-colors" size={32} />
                                </div>
                                <h4 className="text-xl font-black italic uppercase mb-4 text-black">{item.title}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed text-sm italic">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Corporate Entities Cards */}
                <div className="mb-20">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-[2px] w-8 bg-red-600"></div>
                            <span className="text-red-600 font-black italic tracking-[0.2em] uppercase text-[10px]">Registry</span>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-black italic text-black uppercase tracking-tight">
                            Legal <span className="text-red-600">Entities</span>
                        </h3>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {corporateInfos.map((info, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${idx === 0
                                        ? 'bg-black text-white border-black hover:shadow-2xl hover:shadow-black/20'
                                        : 'bg-white text-black border-gray-100 hover:border-red-600 hover:shadow-2xl hover:shadow-red-600/5'
                                    }`}
                            >
                                {/* Decorative BG elements */}
                                <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] -mr-24 -mt-24 opacity-20 transition-transform duration-700 group-hover:scale-125 ${idx === 0 ? 'bg-red-600' : 'bg-red-500'}`}></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-[-6deg] ${idx === 0 ? 'bg-red-600/20 text-red-600' : 'bg-black text-white'}`}>
                                            <Building2 size={20} />
                                        </div>
                                        <h4 className="text-xl md:text-2xl font-[1000] italic uppercase leading-none tracking-tighter">
                                            {info.name}
                                        </h4>
                                    </div>

                                    {info.specialty && (
                                        <p className="text-red-500 font-black italic text-[10px] uppercase tracking-widest mb-6 pb-3 border-b border-red-500/10">
                                            {info.specialty}
                                        </p>
                                    )}

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${idx === 0 ? 'text-gray-500' : 'text-gray-400'}`}>GST Number</span>
                                            <span className={`text-base font-black italic tracking-widest ${idx === 0 ? 'text-white' : 'text-black'}`}>{info.gst}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${idx === 0 ? 'text-gray-400' : 'text-gray-400'}`}>CIN Number</span>
                                            <span className="text-base font-black italic tracking-widest text-red-600">{info.cin}</span>
                                        </div>
                                    </div>

                                    {/* Small floating status icon */}
                                    <div className="absolute top-8 right-8">
                                        <CheckCircle2 size={16} className={`${idx === 0 ? 'text-red-600' : 'text-green-500'} opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Corporate Grid & Detailed Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 overflow-hidden rounded-[4rem] border border-blue-100 shadow-2xl transition-all hover:shadow-blue-500/10"
                >
                    <div className="bg-[#eefbff] p-12 lg:p-20 relative flex flex-col lg:flex-row items-center gap-16">
                        {/* Left Side: Contact Info */}
                        <div className="flex-1 space-y-8 z-10 w-full">
                            <div className="grid gap-6">
                                {/* Phone Numbers */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <Phone size={18} className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-gray-800 tracking-wide uppercase italic border-b border-blue-200 inline-block mb-3">Hotlines</p>
                                        <p className="text-sm md:text-[15px] font-bold text-gray-600 leading-relaxed italic">
                                            011-44724712 , 87449-87441, 87449-87442, 87449-87443, 87449-87445
                                        </p>
                                    </div>
                                </div>

                                {/* Main Email */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <Mail size={18} className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <a href="mailto:info@dot2dotz.com" className="text-sm md:text-[15px] font-[900] text-gray-800 hover:text-blue-600 transition-colors italic tracking-widest">
                                            info@dot2dotz.com
                                        </a>
                                    </div>
                                </div>

                                {/* Website */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <Globe size={18} className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <a href="https://dot2dotz.com" target="_blank" rel="noreferrer" className="text-sm md:text-[15px] font-[900] text-gray-800 hover:text-blue-600 transition-colors italic tracking-widest uppercase underline decoration-blue-300 underline-offset-4">
                                            dot2dotz.com
                                        </a>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <MapPin size={18} className="text-blue-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm md:text-[15px] font-bold text-gray-700 leading-relaxed italic pr-12">
                                            CW-541, First Floor, Sanjay Gandhi Transport Nagar, <br />
                                            New Delhi-110042
                                        </p>
                                    </div>
                                </div>

                                {/* WhatsApp/Secondary Phone */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                                        <Phone size={18} className="text-green-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <a href="tel:8744987441" className="text-sm md:text-[15px] font-[1000] text-gray-800 italic group-hover:text-green-600 transition-colors tracking-widest">
                                            8744987441
                                        </a>
                                    </div>
                                </div>

                                {/* Order Email */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                                        <Mail size={18} className="text-red-600 group-hover:text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <a href="mailto:order.dot2dotz@gmail.com" className="text-sm md:text-[15px] font-black text-gray-800 hover:text-red-600 transition-colors italic tracking-widest">
                                            order.dot2dotz@gmail.com
                                        </a>
                                    </div>
                                </div>

                                {/* Director signature in contact block */}
                                <div className="flex items-start gap-4 group">
                                    <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black transition-colors">
                                        <Star size={18} className="text-black group-hover:text-white" />
                                    </div>
                                    <div className="flex-1 border-t border-black/5 pt-4">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] italic mb-1">Director</p>
                                        <p className="text-2xl font-[1000] italic text-black uppercase tracking-tighter">Sandeep Sherawat</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Large Transport Image */}
                        <div className="flex-1 relative group w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 1 }}
                                className="relative z-10"
                            >
                                <img
                                    src={transportImg}
                                    alt="Dot2Dotz Logistics Truck"
                                    className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] group-hover:translate-x-4 transition-transform duration-700"
                                />
                                {/* Glow reflection under the truck */}
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-blue-400/20 blur-[60px] rounded-full -z-10 animate-pulse"></div>
                            </motion.div>

                            {/* Decorative background circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 rounded-full blur-[80px] -z-10"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;
