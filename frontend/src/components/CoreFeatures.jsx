import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Globe, Handshake } from 'lucide-react';

const CoreFeatures = () => {
    const features = [
        {
            icon: Sparkles,
            title: "Hasslefree Shipment",
            description: "Seamless logistics solutions for all shipment sizes across India, handled with care.",
        },
        {
            icon: ShieldCheck,
            title: "Safety & Reliability",
            description: "Advanced security protocols and verified partners ensure your cargo is always safe.",
        },
        {
            icon: Globe,
            title: "Pan-India Network",
            description: "Coverage across 19,100+ pin codes and 4,000+ cities for nationwide reach.",
        },
        {
            icon: Handshake,
            title: "Trusted Partner",
            description: "Transparent pricing and consistent communication throughout your shipping journey.",
        },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Values</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight"
                    >
                        Why Choose <span className="text-red-500">Dot2Dotz?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-2xl mx-auto font-medium"
                    >
                        We combine cutting-edge technology with operational reliability to deliver excellence in every shipment.
                    </motion.p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group p-10 bg-white rounded-3xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300"
                            >
                                <div className="space-y-6">
                                    <div className="relative w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                                        <Icon size={24} strokeWidth={2.5} />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
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

export default CoreFeatures;
