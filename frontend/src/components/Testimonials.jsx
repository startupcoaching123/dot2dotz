import React from 'react';
import { motion } from 'framer-motion';
import { Eye, MessageSquare, Truck } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Alex Nick",
            role: "DO PART LOAD AND FULL LOAD",
            description: "DO PART LOAD AND FULL LOAD",
            quote: "Over 10 Years of operational excellence",
            tags: ["Machine Load", "Furniture Load"],
            views: "1.2k",
            comments: "10",
            image: "https://i.pravatar.cc/150?u=alex"
        },
        {
            id: 2,
            name: "Sara Grey",
            role: "DO PART LOAD AND FULL LOAD",
            description: "DO FULL LOAD",
            quote: "Over 20 Years of operational excellence",
            tags: ["Furniture Load"],
            views: "1.2k",
            comments: "10",
            image: "https://i.pravatar.cc/150?u=sara"
        }
    ];

    return (
        <section className="py-20 bg-white overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header Section */}
                <div className="flex flex-col items-center mb-20">
                    <div className="flex items-center w-full max-w-2xl mb-8">
                        <div className="flex-grow h-[1px] bg-red-200"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-2"></div>
                        <div className="px-6 py-2 border border-red-200 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-[11px] font-bold tracking-tight">3940+ Happy Landingfolio Users</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mx-2"></div>
                        <div className="flex-grow h-[1px] bg-red-200"></div>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-center">
                        WHY TRUST OUR <span className="text-red-500">VENDORS</span>
                    </h2>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 px-8 py-8 relative group"
                        >
                            {/* Vendor Tag */}
                            <div className="absolute top-10 left-10">
                                <span className="bg-slate-50 text-red-500 text-[10px] font-bold px-4 py-1.5 rounded-lg border border-slate-100 group-hover:bg-red-50 transition-colors uppercase">
                                    Vendor
                                </span>
                            </div>

                            {/* Truck Icon */}
                            <div className="absolute top-10 right-10 text-red-500">
                                <Truck size={28} strokeWidth={1.5} />
                            </div>

                            <div className="mt-12 space-y-6">
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{item.description}</p>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">
                                        “{item.quote}”
                                    </h3>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {item.tags.map((tag, idx) => (
                                        <span key={idx} className="px-5 py-2 rounded-full border border-slate-200 text-[11px] font-bold text-slate-500">
                                            {tag}
                                        </span>
                                    ))}

                                    <div className="flex items-center gap-4 ml-auto text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Eye size={16} />
                                            <span className="text-[11px] font-bold">{item.views}</span>
                                        </div>
                                        <div className="w-px h-4 bg-slate-200"></div>
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare size={16} />
                                            <span className="text-[11px] font-bold">{item.comments}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 mt-8 border-t border-slate-50 flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-14 h-14 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                                    />
                                    <div>
                                        <h4 className="font-bold text-slate-800 tracking-tight">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
                .font-sans {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </section>
    );
};

export default Testimonials;
