import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Headset } from 'lucide-react';
import personImg from '../assets/person.png';

const FreeAssistance = () => {
    const contactNumbers = [
        "+91 8744987441",
        "+91 8744987442",
        "+91 8744987443",
        "+91 8744987444"
    ];

    return (
        <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-4xl">
            {/* Full-bleed Background Image */}
            <div className="absolute inset-0">
                <img
                    src={personImg}
                    alt="Free Assistance"
                    className="w-full h-full object-cover object-center lg:object-[center_20%]"
                />
                {/* Subtle dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
                <div className="max-w-2xl space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a1a1a] leading-tight">
                            Free Assistance
                        </h2>
                        <p className="text-lg md:text-xl text-[#333333] font-bold max-w-lg leading-snug">
                            Speak directly with our logistics experts and get <br />
                            instant assistance for your shipment requirements <br />
                            across India.
                        </p>
                    </motion.div>

                    {/* Contact Buttons Group - matching the mockup's 2x2 pill layout */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
                    >
                        {contactNumbers.map((num, idx) => (
                            <a
                                key={idx}
                                href={`tel:${num.replace(/\s/g, '')}`}
                                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#1a1a1a] font-bold py-4 px-8 rounded-full shadow-lg transition-transform active:scale-95 border border-gray-100"
                            >
                                {/* Left column indices in the mockup don't have icons, right column do. Following that logic: */}
                                {idx % 2 !== 0 && <Phone size={18} className="text-[#1a1a1a]" />}
                                <span className="text-sm md:text-base">{num}</span>
                            </a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FreeAssistance;
