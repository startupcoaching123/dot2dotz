import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Truck, Users } from 'lucide-react';

const WhyChooseUs = () => {
    const stats = [
        {
            number: "3000+",
            title: "Cities Connected",
            description: "Pan-India coverage for every route",
            icon: Target,
        },
        {
            number: "300+",
            title: "On Time Delivery",
            description: "Your cargo arrives when promised",
            icon: Clock,
        },
        {
            number: "1100+",
            title: "Trucks",
            description: "Good-Condition Trucks you can rely on",
            icon: Truck,
        },
        {
            number: "1000+",
            title: "Verified Vendors",
            description: "Rated drivers and partners you can rely on",
            icon: Users,
        },
    ];

    return (
        <section className="relative w-full py-18 bg-slate-50/50 overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                {/* Heading */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        Why Choose Dot<span className="text-red-600">2</span>Dotz
                    </h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-8 bg-white rounded-3xl border border-slate-200 shadow-sm flex justify-between items-start transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1"
                            >
                                <div className="space-y-4 pr-2">
                                    <h4 className="text-4xl md:text-5xl font-extrabold text-red-500 tracking-tighter">
                                        {stat.number}
                                    </h4>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                                            {stat.title}
                                        </h3>
                                        <p className="text-slate-400 text-[11px] font-semibold mt-2 leading-relaxed">
                                            {stat.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-red-500 flex-shrink-0 group-hover:bg-red-50 transition-colors duration-300">
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                .font-sans {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
        </section>
    );
};

export default WhyChooseUs;
