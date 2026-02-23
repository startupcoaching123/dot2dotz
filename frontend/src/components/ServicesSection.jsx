import React, { useState } from 'react';
import { ArrowRight, Truck } from 'lucide-react';
import fullLoadImg from '../assets/full-load.jpeg';
import partLoadImg from '../assets/part-load.jpeg';

const ServicesSection = () => {
    const [activeTab, setActiveTab] = useState('B2B');

    const tabs = ['B2B', 'B2C', 'Partner'];

    const b2bContent = [
        {
            title: "Full Load",
            image: fullLoadImg,
            description: "Full Truck Load is best suited for large shipments above 5–6 tons or bulk goods that require a dedicated vehicle. The truck is exclusively assigned to one client, ensuring faster transit, reduced handling, and direct delivery from origin to destination.",
            estimateColor: "bg-[#D98B94]",
            bookColor: "bg-black"
        },
        {
            title: "Part Load",
            image: partLoadImg,
            description: "Part Truck Load is ideal for shipments typically ranging from 50 kg to 5 tons, where a full truck is not required. Multiple consignments share the same vehicle based on route compatibility, making it a cost-effective option for business shipments.",
            estimateColor: "bg-[#D98B94]",
            bookColor: "bg-black"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">

                {/* Modern Tab Bar */}
                <div className="flex items-center justify-between mb-16 p-2 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="px-6 py-2">
                        <span className="text-sm font-black uppercase tracking-[0.3em] italic text-black">Our Service</span>
                    </div>

                    <div className="flex gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-2.5 rounded-xl text-sm font-black italic tracking-widest uppercase transition-all duration-300 transform ${activeTab === tab
                                    ? 'bg-white text-red-600 shadow-sm border border-red-100 scale-105 skew-x-[-6deg]'
                                    : 'text-gray-400 hover:text-black'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="hidden md:block w-32"></div> {/* Spacer to balance */}
                </div>

                {/* Content Area - Only B2B has content for now */}
                {activeTab === 'B2B' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-speed-reveal">
                        {b2bContent.map((card, index) => (
                            <div
                                key={index}
                                className="group relative bg-white p-12 rounded-[2.5rem] border border-gray-100 transition-all duration-500 hover:shadow-[30px_30px_0_rgba(0,0,0,0.02)] transform hover:translate-y-[-8px] flex flex-col h-full"
                            >
                                {/* Speed Accent Line */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-red-600 transition-all duration-500 group-hover:w-1/2 rounded-full"></div>

                                <div className="flex flex-col items-center text-center h-full">
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-black">
                                        {card.title}
                                    </h3>

                                    <div className="relative mb-8 h-16 w-full flex justify-center items-center overflow-hidden">
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="h-full object-contain transform group-hover:scale-110 group-hover:translate-x-4 transition-all duration-700"
                                        />
                                        {/* Motion Trails */}
                                        <div className="absolute left-[30%] top-1/2 w-12 h-[2px] bg-red-600/20 translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100"></div>
                                        <div className="absolute left-[35%] top-[60%] w-8 h-[2px] bg-red-600/10 translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                                    </div>

                                    <p className="text-gray-500 font-bold italic leading-relaxed mb-auto max-w-sm">
                                        {card.description}
                                    </p>

                                    <div className="flex gap-4 w-full mt-10">
                                        <button className={`flex-1 ${card.estimateColor} text-white font-black py-4 px-6 rounded-xl italic uppercase tracking-widest text-xs transition-all duration-300 transform hover:skew-x-[-6deg] hover:brightness-105 active:scale-95 shadow-lg shadow-[#D98B94]/20`}>
                                            Get Estimate
                                        </button>
                                        <button className={`flex-1 ${card.bookColor} text-white font-black py-4 px-6 rounded-xl italic uppercase tracking-widest text-xs transition-all duration-300 transform hover:skew-x-[-6deg] hover:bg-gray-800 active:scale-95 shadow-lg shadow-black/10`}>
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem] italic font-black text-gray-300 uppercase tracking-widest">
                        Content coming soon for {activeTab}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes speed-reveal {
                    from { 
                        opacity: 0; 
                        transform: translateX(-30px) skewX(10deg); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0) skewX(0); 
                    }
                }
                .animate-speed-reveal {
                    animation: speed-reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                }
            `}</style>
        </section>
    );
};

export default ServicesSection;
