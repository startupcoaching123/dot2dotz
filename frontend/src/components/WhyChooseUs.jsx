import React from 'react';
import { MapPin, Clock, Truck, ShieldCheck } from 'lucide-react';

const WhyChooseUs = () => {
    const stats = [
        {
            icon: <MapPin className="text-red-500" size={24} />,
            number: "3000+",
            title: "Cities Connected",
            description: "Pan-India coverage for every route you need.",
        },
        {
            icon: <Clock className="text-red-500" size={24} />,
            number: "300+",
            title: "On Time Delivery",
            description: "Your cargo arrives exactly when we promised.",
        },
        {
            icon: <Truck className="text-red-500" size={24} />,
            number: "1100+",
            title: "Modern Trucks",
            description: "Good condition trucks you can always rely on.",
        },
        {
            icon: <ShieldCheck className="text-red-500" size={24} />,
            number: "1000+",
            title: "Verified Vendors",
            description: "Rated drivers and partners you can trust.",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                {/* Section Heading */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 uppercase italic">
                        Why choose DOT<span className="text-red-600">2</span>DOTZ
                    </h2>
                    <div className="w-20 h-1.5 bg-red-600 mx-auto mt-4 rounded-full"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group p-10 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-black hover:bg-white transition-all duration-500 hover:shadow-[20px_20px_0_rgba(0,0,0,0.03)] transform hover:skew-y-[-1deg]"
                        >
                            <div className="mb-8 relative">
                                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-12deg]">
                                    {React.cloneElement(stat.icon, {
                                        className: `transition-colors duration-300 ${stat.icon.props.className} group-hover:text-white`
                                    })}
                                </div>
                                {/* Motion Lines Decoration */}
                                <div className="absolute top-2 left-16 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-8 h-[2px] bg-red-600/30 animate-pulse"></div>
                                    <div className="w-12 h-[2px] bg-red-600/20"></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-5xl font-black text-black tracking-tighter italic">
                                    {stat.number}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-widest italic">
                                        {stat.title}
                                    </p>
                                </div>
                                <p className="text-[13px] text-gray-500 leading-relaxed font-bold italic">
                                    {stat.description}
                                </p>
                            </div>

                            {/* Decorative Red Accent */}
                            <div className="mt-8 overflow-hidden h-1 bg-gray-100 rounded-full">
                                <div className="w-0 group-hover:w-full h-full bg-red-600 transition-all duration-1000 ease-out"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
