import React from 'react';
import { User, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            serviceType: "PART LOAD AND FULL LOAD",
            feedback: "EXPERIENCED SINCE 10 YEARS",
            author: "TVTV COMPANY",
            description: "High reliability and consistent performance across all our logistics requirements."
        },
        {
            serviceType: "PART LOAD AND FULL LOAD",
            feedback: "EXPERIENCED SINCE 10 YEARS",
            author: "TVTV COMPANY",
            description: "Exceptional service quality and timely deliveries for our bulk shipments."
        }
    ];

    return (
        <section className="py-24 bg-[#757575] relative overflow-hidden">
            {/* Speed Accents for Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30"></div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-[0.2em] text-white">
                        WHY TRUST OUR <span className="text-red-600">VENDORS</span>
                    </h2>
                    <div className="w-24 h-1 bg-red-600 mx-auto mt-6 rounded-full transform skew-x-[-20deg]"></div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {testimonials.map((item, index) => (
                        <div key={index} className="group relative">
                            {/* Speech Bubble Card */}
                            <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-2xl transform transition-all duration-500 group-hover:translate-y-[-10px] group-hover:skew-x-[-1deg] relative">
                                {/* Quote Icon speed accent */}
                                <div className="absolute top-8 right-10 text-gray-100 group-hover:text-red-50/50 transition-colors">
                                    <Quote size={80} fill="currentColor" />
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <span className="inline-block text-red-600 font-black italic tracking-widest text-sm uppercase">
                                        {item.serviceType}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-black italic text-black uppercase leading-tight">
                                        "{item.feedback}"
                                    </h3>
                                    <p className="text-gray-500 font-bold italic text-sm md:text-base leading-relaxed max-w-md">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Speech Bubble Tail */}
                                <div className="absolute -bottom-4 left-12 w-8 h-8 bg-white transform rotate-45"></div>
                            </div>

                            {/* Author Info */}
                            <div className="mt-10 ml-6 flex items-center gap-5 group-hover:translate-x-3 transition-transform duration-500">
                                <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center bg-transparent group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                                    <User className="text-white" size={28} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-300 uppercase tracking-[0.3em] mb-1 italic">Ordered By</span>
                                    <span className="text-lg font-black text-white italic tracking-tighter uppercase">{item.author}</span>
                                </div>
                                {/* Speed Lines */}
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-[2px] bg-red-600"></div>
                                    <div className="w-4 h-[2px] bg-red-600/50"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
