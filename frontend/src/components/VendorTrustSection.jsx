import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const VendorTrustSection = () => {
    const trustCards = [
        {
            id: 1,
            tag: "DO PART LOAD AND FULL LOAD",
            quote: "EXPERIANCED SINCED 10 YEARS",
            orderedBy: "ORDERED BY TVTV COMAPANY"
        },
        {
            id: 2,
            tag: "DO PART LOAD AND FULL LOAD",
            quote: "EXPERIANCED SINCED 10 YEARS",
            orderedBy: "ORDERED BY TVTV COMAPANY"
        }
    ];

    return (
        <section className="bg-white">
            {/* Header Section */}
            <div className="py-16 text-center space-y-4">
                <p className="text-red-600 font-bold text-sm tracking-tight">
                    3940+ Happy Landingfolio Users
                </p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">
                    WHY <span className="opacity-80">TRUST</span> OUR <span className="text-red-600">VENDORS</span>
                </h2>
            </div>

            {/* Content Section with Gray Background */}
            <div className="bg-[#757575] py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {trustCards.map((card) => (
                            <div key={card.id} className="space-y-6">
                                {/* White Quote Bubble */}
                                <div className="bg-white rounded-xl p-10 relative shadow-xl">
                                    <div className="space-y-4">
                                        <p className="text-red-600 font-bold text-lg tracking-wide uppercase">
                                            {card.tag}
                                        </p>
                                        <h3 className="text-2xl md:text-3xl font-black text-black uppercase leading-tight">
                                            "{card.quote}"
                                        </h3>
                                    </div>
                                    {/* Small arrow triangle at bottom if needed, but the image shows a clean edge or slight protrusion */}
                                    <div className="absolute -bottom-3 left-10 w-6 h-6 bg-white rotate-45 transform"></div>
                                </div>

                                {/* User Info */}
                                <div className="flex items-center gap-4 px-4 pt-2">
                                    <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center text-white">
                                        <User size={32} />
                                    </div>
                                    <span className="text-white font-bold tracking-wider text-sm uppercase">
                                        {card.orderedBy}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VendorTrustSection;
