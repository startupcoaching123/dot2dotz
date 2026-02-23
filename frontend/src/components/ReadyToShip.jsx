import React from 'react';
import { Phone, ArrowUpRight } from 'lucide-react';

const ReadyToShip = () => {
    const contactNumbers = [
        "+91 87449 87441",
        "+91 87449 87442",
        "+91 87449 87443",
        "+91 87449 87445"
    ];

    return (
        <section className="py-16 px-6 relative overflow-hidden">
            {/* High-Octane Background Container */}
            <div className="max-w-[1400px] mx-auto relative rounded-[2.5rem] overflow-hidden bg-[#BA1122] shadow-[0_50px_100px_-20px_rgba(186,17,34,0.3)]">

                {/* Speed Line Decorations */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-[-10%] w-[120%] h-[1px] bg-white transform rotate-[-5deg]"></div>
                    <div className="absolute top-40 left-[-10%] w-[120%] h-[2px] bg-white transform rotate-[-5deg]"></div>
                    <div className="absolute bottom-20 left-[-10%] w-[120%] h-[1px] bg-white transform rotate-[-5deg]"></div>
                </div>

                <div className="relative z-10 py-12 px-8 text-center">
                    {/* Floating Speed Sparkles */}
                    <div className="flex justify-center mb-6">
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-1 bg-white/20 rounded-full transform skew-x-[-30deg] animate-pulse"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-4 transform hover:scale-105 transition-transform duration-500 cursor-default">
                        Ready to Ship <span className="text-black/20">Your Goods?</span>
                    </h2>

                    <p className="text-white/80 font-bold italic uppercase tracking-[0.15em] text-[11px] md:text-sm max-w-2xl mx-auto leading-relaxed mb-10">
                        Speak directly with our logistics experts and get instant assistance for your shipment requirements across India.
                    </p>

                    {/* Contact Buttons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
                        {contactNumbers.map((number, index) => (
                            <a
                                key={index}
                                href={`tel:${number.replace(/\s/g, '')}`}
                                className="group relative bg-white py-6 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 hover:bg-black hover:skew-x-[-6deg] hover:translate-y-[-5px] shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden"
                            >
                                {/* Speed Wipe Effect */}
                                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-5"></div>

                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                                    <Phone size={18} className="group-hover:rotate-12 transition-transform" />
                                </div>
                                <span className="text-xl font-black italic tracking-tighter text-black group-hover:text-white transition-colors duration-300">
                                    {number}
                                </span>
                                <ArrowUpRight
                                    size={16}
                                    className="text-red-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                                />
                            </a>
                        ))}
                    </div>

                    {/* Bottom Dynamic Decor */}
                    <div className="mt-16 flex justify-center items-center gap-6">
                        <div className="w-24 h-[1px] bg-white/20"></div>
                        <span className="text-white/40 text-[10px] font-black italic uppercase tracking-[0.4em]">24/7 Priority Support</span>
                        <div className="w-24 h-[1px] bg-white/20"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReadyToShip;
