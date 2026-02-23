import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, Clock, Headphones, CheckCircle2, Globe, Building2, Phone, Mail, MapPin } from 'lucide-react';

const AboutSection = () => {
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
        <section id="company" className="relative py-24 bg-white overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-red-50/30 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gray-50 -skew-x-12 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
                {/* Section Header */}
                <div className="mb-20 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6 justify-center lg:justify-start"
                    >
                        <div className="h-[2px] w-12 bg-red-600"></div>
                        <span className="text-red-600 font-black italic tracking-[0.3em] uppercase text-sm">Our Story</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl lg:text-7xl font-[1000] italic text-black leading-tight tracking-tight mb-8"
                    >
                        DOT2DOTZ: <span className="text-red-600 underline decoration-black/5 underline-offset-8">INNOVATING</span> <br />
                        INDIAN LOGISTICS.
                    </motion.h2>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-start mb-32">
                    {/* Left Column: Mission & Vision */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="prose prose-lg max-w-none"
                        >
                            <p className="text-xl lg:text-2xl text-gray-800 font-bold italic leading-relaxed mb-8 border-l-4 border-red-600 pl-8">
                                Dot2dotz is an online transport service that offers a hassle-free way to all your transport needs/requirements.
                                We are a Delhi-based online transport booking company, operational in all major cities across India.
                            </p>
                            <div className="space-y-6 text-gray-600 font-medium">
                                <p>
                                    Since our establishment in mid-2016, we have been striving to provide the best possible online truck booking experience.
                                    We believe in offering transparent and affordable rates, quick and easy booking process, and excellent customer service.
                                </p>
                                <p>
                                    Whether you need to book a Light or Heavy Commercial Vehicle for a short distance or require a full-scale transportation solution, our system is built to accommodate a wide range of needs with precision and speed.
                                </p>
                            </div>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:skew-y-1 transition-transform"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <h3 className="text-2xl font-black italic text-red-600 uppercase mb-4 tracking-wider">Our Mission</h3>
                                <p className="text-gray-300 leading-relaxed font-medium">
                                    To provide an online truck booking service that makes it easy for customers to find and book trucks for moving goods locally and interstate.
                                    We aim to make logistics affordable, reliable, and convenient for everyone.
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="bg-red-600 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:-skew-y-1 transition-transform"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <h3 className="text-2xl font-black italic text-white uppercase mb-4 tracking-wider">Our Vision</h3>
                                <p className="text-red-50 leading-relaxed font-medium">
                                    To revolutionize the Indian transport industry through technology, offering a one-stop solution for real-time availability, tracking, and fair pricing.
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Column: Key Stats / Experience */}
                    <div className="lg:col-span-12 xl:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-gray-50 border border-gray-100 p-12 rounded-[3rem] relative"
                        >
                            <div className="absolute -top-6 -left-6 w-20 h-20 bg-black text-white rounded-full flex items-center justify-center font-black italic shadow-xl">
                                2016
                            </div>
                            <h4 className="text-2xl font-black mb-8 text-black italic uppercase">Why We Started</h4>
                            <p className="text-gray-600 font-medium mb-10 leading-relaxed italic">
                                "We started our truck service in Delhi to provide customers with a better online truck booking experience.
                                We understand that not everyone is familiar with booking a truck, so we made our platform as simple as a few clicks."
                            </p>
                            <div className="space-y-6">
                                {[
                                    "Real-time tracking and pricing",
                                    "Extensive network of verified drivers",
                                    "Diverse fleet for all cargo types",
                                    "Pan-India operational presence"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center group">
                                        <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                                            <CheckCircle2 size={14} className="text-red-600 group-hover:text-white" />
                                        </div>
                                        <span className="font-bold text-gray-800 text-sm tracking-wide">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Differentiators Section */}
                <div className="mb-32">
                    <div className="mb-16">
                        <h3 className="text-4xl lg:text-5xl font-black italic text-black uppercase mb-4 tracking-tight">
                            What Makes Us <span className="text-red-600 font-black italic">Different?</span>
                        </h3>
                        <div className="h-1.5 w-32 bg-black"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {differentiators.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 bg-white border border-gray-100 rounded-[2rem] hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/5 transition-all group"
                            >
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors group-hover:rotate-6">
                                    <item.icon className="text-red-600 group-hover:text-white transition-colors" size={28} />
                                </div>
                                <h4 className="text-lg font-black italic uppercase mb-4 text-black tracking-wide">{item.title}</h4>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Corporate Footer / Contact Details */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-black/5 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[100px]"></div>

                    <div className="grid lg:grid-cols-3 gap-16 relative z-10">
                        {/* Company Details */}
                        <div className="col-span-2 grid md:grid-cols-2 gap-12">
                            {corporateInfos.map((info, idx) => (
                                <div key={idx} className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="text-red-600" size={20} />
                                        <h5 className="font-black italic uppercase tracking-wider text-black">{info.name}</h5>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        {info.specialty && <p className="text-red-600 font-black italic text-xs mb-3">{info.specialty}</p>}
                                        <p className="flex justify-between border-b border-black/5 pb-2">
                                            <span className="text-gray-400 font-bold uppercase text-[10px]">GST NO</span>
                                            <span className="font-black text-black tracking-widest">{info.gst}</span>
                                        </p>
                                        <p className="flex justify-between border-b border-black/5 pb-2">
                                            <span className="text-gray-400 font-bold uppercase text-[10px]">CIN NO</span>
                                            <span className="font-black text-black tracking-widest">{info.cin}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Column */}
                        <div className="space-y-8">
                            <div className="p-8 bg-black rounded-[2rem] text-white">
                                <h5 className="text-lg font-black italic uppercase mb-6 text-red-600 tracking-wider">Reach Us Directly</h5>
                                <div className="space-y-4">
                                    <a href="tel:8744987441" className="flex items-center gap-4 group">
                                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-600 transition-colors">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-sm font-bold tracking-widest">+91 87449 87441</span>
                                    </a>
                                    <a href="mailto:info@dot2dotz.com" className="flex items-center gap-4 group">
                                        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-600 transition-colors">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-bold tracking-widest">info@dot2dotz.com</span>
                                    </a>
                                    <div className="flex items-start gap-4 pt-4 border-t border-white/10 mt-4">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <MapPin size={16} />
                                        </div>
                                        <p className="text-[12px] font-medium leading-relaxed text-gray-400 italic">
                                            CW-541, First Floor, Sanjay Gandhi Transport Nagar, New Delhi-110042
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <span className="text-black font-black italic uppercase text-xs tracking-[0.5em]">Director: Sandeep Sherawat</span>
                        <span className="text-red-600 font-black italic uppercase text-xs tracking-widest">All India Logistics Service</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
