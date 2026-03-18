import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Lightbulb } from 'lucide-react';
import personImg from '../assets/person.png';

const ReadyToShip = () => {
    const contactNumbers = [
        "+91 87449 87441",
        "+91 87449 87441",
        "+91 87449 87441",
        "+91 87449 87441"
    ];

    return (
        <section className="py-20 bg-white font-sans overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                            <img
                                src={personImg}
                                alt="Logistics Expert"
                                className="w-full h-full object-cover aspect-[4/3] lg:aspect-square"
                            />
                        </div>
                        {/* Subtle decorative element */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-50 rounded-full -z-10 blur-2xl opacity-60"></div>
                    </motion.div>

                    {/* Right Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-10"
                    >
                        <div className="space-y-6">
                            {/* Icon with decorative blob */}
                            <div className="relative inline-flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50 scale-150"></div>
                                <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500/10 rounded-full"></div>
                                <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white shadow-sm">
                                    <Lightbulb className="text-slate-800" size={28} />
                                </div>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                <span className="text-red-500">Free</span> Assistance
                            </h2>

                            <p className="text-slate-500 font-medium text-sm md:text-base max-w-lg leading-relaxed">
                                Speak directly with our logistics experts and get instant assistance for your shipment requirements across India.
                            </p>
                        </div>

                        {/* Contact Buttons Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {contactNumbers.map((number, index) => (
                                <motion.a
                                    key={index}
                                    href={`tel:${number.replace(/\s/g, '')}`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-4 px-6 py-5 bg-white border border-slate-200 rounded-full hover:border-red-200 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="text-slate-400 group-hover:text-red-500">
                                        <Phone size={20} strokeWidth={1.5} />
                                    </div>
                                    <span className="text-slate-700 font-bold tracking-tight text-sm">
                                        {number}
                                    </span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
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

export default ReadyToShip;
