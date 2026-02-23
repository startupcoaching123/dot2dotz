import React from 'react';
import { ClipboardList, CreditCard, Truck, CheckCircle, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <ClipboardList size={32} />,
            title: "Book Online",
            description: "Enter pickup and delivery details, get instant price estimate",
        },
        {
            icon: <CreditCard size={32} />,
            title: "Make Payment",
            description: "Pay securely online or choose Cash on Delivery",
        },
        {
            icon: <Truck size={32} />,
            title: "We Pickup",
            description: "Our verified driver collects your shipment from your doorstep",
        },
        {
            icon: <CheckCircle size={32} />,
            title: "Delivered",
            description: "Track in real-time until safe delivery to destination",
        },
    ];

    return (
        <section className="py-24 bg-[#F9F9F9] overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">

                {/* Section Header */}
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-black mb-4">
                        How It <span className="text-red-600">Works</span>
                    </h2>
                    <p className="text-gray-500 font-bold italic uppercase tracking-widest text-sm">
                        Simple and transparent shipping process in just 4 easy steps
                    </p>
                    <div className="w-24 h-1 bg-red-600 mx-auto mt-6 rounded-full transform skew-x-[-20deg]"></div>
                </div>

                {/* Steps Container */}
                <div className="relative">
                    {/* Road Theme Progress Track */}
                    <div className="absolute top-16 left-0 w-full h-12 bg-[#2a2a2a] hidden lg:block rounded-full shadow-inner overflow-hidden border-t border-b border-white/5">
                        {/* Road Marking (Center Line) */}
                        <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 flex justify-around px-4">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-8 h-full bg-[#fcd34d] opacity-50"></div> // Yellow dash
                            ))}
                        </div>
                        {/* Asphalt Texture Overlay */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:4px_4px]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10 pt-4">
                        {steps.map((step, index) => (
                            <div key={index} className="group flex flex-col items-center text-center">
                                {/* Icon Container */}
                                <div className="relative mb-8">
                                    {/* Connection Node */}
                                    <div className="hidden lg:block absolute top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 z-0">
                                        <div className="w-3 h-3 bg-red-600 border-2 border-red-600 rounded-full transition-all duration-300"></div>
                                    </div>

                                    <div className="relative z-10 w-32 h-32 bg-white rounded-[2rem] border-4 border-red-600 flex items-center justify-center text-red-600 transition-all duration-500 transform group-hover:skew-x-[-6deg] group-hover:shadow-[20px_20px_0_rgba(220,38,38,0.05)]">
                                        {step.icon}
                                    </div>

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-black text-white font-black italic flex items-center justify-center rounded-xl transform skew-x-[-12deg] group-hover:bg-red-600 transition-colors duration-300 z-20">
                                        0{index + 1}
                                    </div>

                                    {/* Speed Lines on Hover */}
                                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                        <div className="w-6 h-[2px] bg-red-600/40"></div>
                                        <div className="w-10 h-[2px] bg-red-600/20"></div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="space-y-3">
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-black flex items-center justify-center gap-2">
                                        {step.title}
                                        <ChevronRight size={18} className="text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </h3>
                                    <p className="text-gray-500 text-sm font-bold italic leading-relaxed px-4 group-hover:text-gray-900 transition-colors">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Speed Accent */}
                <div className="mt-20 flex justify-center">
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-8 h-1 bg-red-600/10 rounded-full transform skew-x-[-30deg]"
                                style={{ opacity: 1 - (i * 0.2) }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .writing-vertical {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </section>
    );
};

export default HowItWorks;
