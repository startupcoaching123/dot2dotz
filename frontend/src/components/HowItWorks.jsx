import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CreditCard, Truck, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: ClipboardList,
            title: "Book Online",
            description: "Enter your pickup and drop-off details for an instant, transparent quote.",
        },
        {
            icon: CreditCard,
            title: "Secure Payment",
            description: "Pay conveniently via encrypted digital portals or choose Cash on Delivery.",
        },
        {
            icon: Truck,
            title: "Swift Pickup",
            description: "A verified logistics expert arrives promptly at your location for collection.",
        },
        {
            icon: CheckCircle,
            title: "Safe Delivery",
            description: "Track your shipment in real-time until it successfully reaches the destination.",
        },
    ];

    return (
        <section className="py-20 bg-white overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto px-4">

                {/* Section Header */}
                <div className="text-center mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-4 py-1.5 bg-red-50 rounded-full border border-red-100"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Our Process</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight"
                    >
                        How It <span className="text-red-500">Works</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-xl mx-auto font-medium"
                    >
                        Experience a frictionless shipping journey. Our streamlined process gets your cargo moving in four precise steps.
                    </motion.p>
                </div>

                {/* Steps Container */}
                <div className="relative">
                    {/* Desktop Connector Line */}
                    <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-slate-100 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-20 group-hover:bg-red-500 transition-colors">
                                        0{index + 1}
                                    </div>

                                    {/* Icon Container */}
                                    <div className="w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center text-red-500 mb-8 shadow-sm group-hover:border-red-200 group-hover:shadow-xl group-hover:shadow-red-500/5 transition-all duration-300">
                                        <Icon size={28} />
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3">
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Mobile/Tablet Connector Arrow (Optional, subtle indicator) */}
                                    {index < steps.length - 1 && (
                                        <div className="lg:hidden mt-8 text-slate-200">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 md:rotate-0">
                                                <path d="M5 12h14m-7-7l7 7-7 7" />
                                            </svg>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
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

export default HowItWorks;
