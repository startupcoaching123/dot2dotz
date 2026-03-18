import React from 'react';
import { motion } from 'framer-motion';

const ServicesSection = () => {
  const services = [
    {
      title: "Full Load",
      description: "Full Truck Load is best suited for large shipments above 5-6 tons or bulk goods that require a dedicated vehicle. The truck is exclusively assigned to one client, ensuring faster transit, reduced handling, and direct delivery.",
      bgColor: "bg-[#F0F7FA]",
      icon: <path d="M10 17h4V5H2v12h3m1 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m0-4h4a2 2 0 0 0 2-2V6l-3-4h-7v1h7l2 3h-2" />
    },
    {
      title: "Part Load",
      description: "Part Truck Load is ideal for shipments typically ranging from 50 kg to 5 tons. Multiple consignments share the same vehicle based on route compatibility, making it a cost-effective option for regular dispatches.",
      bgColor: "bg-[#F4F7F9]",
      icon: <path d="M16 16h6V4H10v12h2m1 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0m-8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M3 12h4v4M13 12h3M13 8h6M13 4h4" />
    },
    {
      title: "Shared Load",
      description: "Shared Load services combine multiple smaller shipments into one vehicle, maximizing space utilization. Perfect for businesses looking to reduce costs with eco-friendly solutions and route optimization.",
      bgColor: "bg-[#F2F9F6]",
      icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    }
  ];

  return (
    <section className="w-full py-20 bg-white overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
        {/* Header Section */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-slate-800 tracking-tight mb-8"
        >
          Our Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium mb-16"
        >
          Simple and transparent shipping process in just 4 easy steps
        </motion.p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-10 ${service.bgColor} border border-slate-300/50 rounded-[2.5rem] transition-all duration-300 hover:shadow-xl hover:border-slate-400 group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative shadow-sm">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      {service.icon}
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    {service.title}
                  </h3>
                </div>

                <p className="text-slate-600 leading-relaxed mb-12 text-[15px] font-medium">
                  {service.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-auto">
                <button className="px-7 py-4 bg-[#FF5A5F] text-white rounded-full font-bold text-xs hover:bg-[#ff444a] transition-all shadow-md">
                  Get Estimate
                </button>
                <button className="px-7 py-4 bg-[#1A1A1A] text-white rounded-full font-bold text-xs hover:bg-black transition-all shadow-md">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
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

export default ServicesSection;

