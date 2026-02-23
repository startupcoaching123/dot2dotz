import React from 'react';
import { Sparkles, ShieldCheck, Globe, Handshake } from 'lucide-react';

const CoreFeatures = () => {
    const features = [
        {
            icon: <Sparkles size={32} className="text-red-600" />,
            title: "Hasslefree Shipment",
            description: "Seamless logistics solutions for all shipment sizes across India.",
        },
        {
            icon: <ShieldCheck size={32} className="text-red-600" />,
            title: "Safety & Reliability",
            description: "Advanced security tools ensure safe and reliable deliveries.",
        },
        {
            icon: <Globe size={32} className="text-red-600" />,
            title: "Pan-India Network",
            description: "19,100+ pin codes & 4,000+ cities covered nationwide.",
        },
        {
            icon: <Handshake size={32} className="text-red-600" />,
            title: "Trusted Partner",
            description: "Transparent pricing & complete trust throughout your journey.",
        },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Speed Background Patterns */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/30 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-50/50 rounded-full filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-black">
                        Why Choose <span className="text-red-600">Dot2Dotz?</span>
                    </h2>
                    <p className="text-gray-500 font-bold italic uppercase tracking-widest text-sm max-w-2xl mx-auto leading-relaxed">
                        We combine technology with reliability to deliver excellence in every shipment
                    </p>
                    <div className="flex justify-center gap-1.5 pt-2">
                        <div className="w-12 h-1 bg-red-600 rounded-full transform skew-x-[-20deg]"></div>
                        <div className="w-4 h-1 bg-black rounded-full transform skew-x-[-20deg]"></div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group p-10 bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[30px_30px_0_rgba(220,38,38,0.03)] transition-all duration-500 transform hover:translate-y-[-10px] hover:skew-y-[-1deg]"
                        >
                            <div className="space-y-8">
                                {/* Icon with Speed Glow */}
                                <div className="relative w-16 h-16 flex items-center justify-center bg-gray-50 rounded-2xl group-hover:bg-black transition-colors duration-500 overflow-hidden">
                                    <div className="relative z-10 group-hover:text-white transition-colors duration-500 group-hover:scale-110">
                                        {feature.icon}
                                    </div>
                                    <div className="absolute inset-0 bg-red-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out opacity-20 group-hover:opacity-10"></div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-black flex flex-col">
                                        <span className="w-8 h-1 bg-red-600 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 w-0 group-hover:w-12 rounded-full"></span>
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-bold italic leading-relaxed group-hover:text-gray-900 transition-colors">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Speed Line Decoration */}
                                <div className="flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-1 bg-red-600 rounded-full"></div>
                                    <div className="w-2 h-1 bg-gray-200 rounded-full"></div>
                                    <div className="w-2 h-1 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreFeatures;
