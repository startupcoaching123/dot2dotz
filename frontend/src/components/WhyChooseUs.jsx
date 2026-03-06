import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, ShieldCheck } from 'lucide-react';

const WhyChooseUs = () => {
    const stats = [
        {
            icon: <MapPin className="text-red-500" size={28} />,
            number: "3000+",
            title: "Cities Connected",
            description: "Pan-India coverage for every route you need.",
        },
        {
            icon: <Clock className="text-red-500" size={28} />,
            number: "300+",
            title: "On Time Delivery",
            description: "Your cargo arrives exactly when we promised.",
        },
        {
            icon: <Truck className="text-red-500" size={28} />,
            number: "1100+",
            title: "Modern Trucks",
            description: "Good condition trucks you can always rely on.",
        },
        {
            icon: <ShieldCheck className="text-red-500" size={28} />,
            number: "1000+",
            title: "Verified Vendors",
            description: "Rated drivers and partners you can trust.",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="w-full py-16 sm:py-20 md:py-28 bg-gradient-to-br from-white via-gray-50 to-white">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 sm:mb-16 md:mb-20"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 uppercase italic leading-tight">
                        Why choose DOT
                        <span className="text-red-600">2</span>DOTZ
                    </h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="h-1.5 bg-gradient-to-r from-red-600 to-red-400 mx-auto mt-4 sm:mt-6 rounded-full"
                    ></motion.div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group relative h-full"
                        >
                            {/* Card Background Gradient */}
                            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Main Card */}
                            <div className="relative h-full p-6 sm:p-8 md:p-10 bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-gray-200 group-hover:border-red-300 hover:shadow-xl transition-all duration-500 overflow-hidden">
                                
                                {/* Animated Top Border */}
                                <div className="absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"></div>

                                {/* Icon Container */}
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className="mb-6 sm:mb-8 relative w-fit"
                                >
                                    <div className="relative">
                                        {/* Icon Background Glow */}
                                        <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-lg group-hover:bg-red-500/20 transition-all duration-300"></div>
                                        
                                        {/* Icon Box */}
                                        <div className="relative bg-white rounded-2xl w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:bg-red-50 transition-all duration-300 border border-gray-100 group-hover:border-red-200">
                                            <motion.div
                                                whileHover={{ rotate: 12 }}
                                                transition={{ type: "spring", stiffness: 400 }}
                                            >
                                                {stat.icon}
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Motion Lines Decoration */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 0 }}
                                        whileHover={{ opacity: 1, x: 10 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-3 sm:top-4 left-20 sm:left-24 space-y-2"
                                    >
                                        <div className="w-6 sm:w-8 h-[2px] bg-red-600/40"></div>
                                        <div className="w-10 sm:w-12 h-[2px] bg-red-600/20"></div>
                                    </motion.div>
                                </motion.div>

                                {/* Content */}
                                <div className="space-y-3 sm:space-y-4">
                                    <motion.h3
                                        initial={{ opacity: 0.7 }}
                                        whileHover={{ opacity: 1 }}
                                        className="text-4xl sm:text-5xl md:text-6xl font-black text-black tracking-tighter italic transition-colors duration-300"
                                    >
                                        {stat.number}
                                    </motion.h3>
                                    
                                    <div className="flex items-center gap-2">
                                        <motion.div
                                            initial={{ scale: 0.5 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="w-2 h-2 bg-red-600 rounded-full group-hover:bg-red-500 transition-colors duration-300"
                                        ></motion.div>
                                        <p className="text-xs sm:text-sm font-black text-gray-900 uppercase tracking-widest italic group-hover:text-red-600 transition-colors duration-300">
                                            {stat.title}
                                        </p>
                                    </div>
                                    
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium italic group-hover:text-gray-700 transition-colors duration-300">
                                        {stat.description}
                                    </p>
                                </div>

                                {/* Bottom Accent Line */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="mt-6 sm:mt-8 h-1 bg-gray-100 rounded-full overflow-hidden origin-left"
                                >
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileHover={{ width: "100%" }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                                    ></motion.div>
                                </motion.div>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/5 rounded-full blur-2xl group-hover:bg-red-600/10 transition-all duration-500 -z-10"></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
