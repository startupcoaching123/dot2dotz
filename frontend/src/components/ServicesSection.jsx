import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, Share2, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const Services = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      id: 0,
      title: "Full Load",
      subtitle: "FTL",
      icon: Truck,
      description: "Full Truck Load is best suited for large shipments above 5–6 tons or bulk goods that require a dedicated vehicle. The truck is exclusively assigned to one client, ensuring faster transit, reduced handling, and direct delivery from origin to destination.",
      benefits: [
        { icon: Zap, text: "Dedicated Vehicle" },
        { icon: Clock, text: "Faster Transit" },
        { icon: Shield, text: "Direct Delivery" }
      ],
      gradient: "from-red-600/20 to-red-600/5",
      borderColor: "border-red-600/30",
      accentColor: "#D98B94"
    },
    {
      id: 1,
      title: "Part Load",
      subtitle: "PTL",
      icon: Package,
      description: "Part Truck Load is ideal for shipments typically ranging from 50 kg to 5 tons, where a full truck is not required. Multiple consignments share the same vehicle based on route compatibility, making it a cost-effective option for business shipments.",
      benefits: [
        { icon: Zap, text: "Cost-Effective" },
        { icon: Clock, text: "Flexible Schedule" },
        { icon: Shield, text: "Route Optimized" }
      ],
      gradient: "from-blue-600/20 to-blue-600/5",
      borderColor: "border-blue-600/30",
      accentColor: "#4F46E5"
    },
    {
      id: 2,
      title: "Shared Load",
      subtitle: "Consolidation",
      icon: Share2,
      description: "Shared Load services combine multiple smaller shipments into one vehicle, maximizing space utilization. Perfect for businesses looking to reduce shipping costs while maintaining reliable delivery schedules with eco-friendly solutions.",
      benefits: [
        { icon: Zap, text: "Eco-Friendly" },
        { icon: Clock, text: "Scheduled Routes" },
        { icon: Shield, text: "Space Efficient" }
      ],
      gradient: "from-green-600/20 to-green-600/5",
      borderColor: "border-green-600/30",
      accentColor: "#10B981"
    }
  ];

  const currentService = services[activeService];
  const CurrentIcon = currentService.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="h-[2px] w-6 sm:w-8 bg-red-600"></div>
            <span className="text-xs sm:text-sm font-black italic tracking-[0.2em] sm:tracking-[0.3em] uppercase text-red-600">
              Our Services
            </span>
            <div className="h-[2px] w-6 sm:w-8 bg-red-600"></div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic text-black mb-3 sm:mb-4 leading-tight"
          >
            Choose Your Shipping Solution
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2"
          >
            Select the perfect logistics service tailored to your shipment size and requirements
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 md:mb-20">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            const isActive = activeService === index;

            return (
              <motion.button
                key={service.id}
                onClick={() => setActiveService(index)}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
                className={`relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-500 text-left group cursor-pointer overflow-hidden ${
                  isActive
                    ? `${service.borderColor} bg-gradient-to-br ${service.gradient} shadow-2xl scale-105`
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
                }`}
              >
                {/* Animated background gradient */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r opacity-5"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${service.accentColor}40, transparent)`,
                    }}
                  />
                )}

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex items-center justify-center w-12 sm:w-14 h-12 sm:h-14 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 transition-all duration-300 ${
                      isActive ? "bg-white shadow-lg" : "bg-gray-100 group-hover:bg-gray-200"
                    }`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <ServiceIcon
                      size={24}
                      className={`transition-colors duration-300 ${
                        isActive ? "text-red-600 stroke-[2.5]" : "text-gray-600"
                      }`}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-black italic mb-1 sm:mb-2 transition-colors duration-300 ${
                    isActive ? "text-black" : "text-gray-800"
                  }`}>
                    {service.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`text-xs sm:text-sm font-bold italic tracking-wider uppercase mb-3 sm:mb-4 transition-colors duration-300 ${
                    isActive ? "text-red-600" : "text-gray-500"
                  }`}>
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  {!isActive && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 group-hover:line-clamp-none transition-all">
                      {service.description.substring(0, 60)}...
                    </p>
                  )}
                </div>

                {/* Hover indicator */}
                {!isActive && (
                  <motion.div
                    className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 text-gray-400 group-hover:text-red-600 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active Service Detail */}
        <motion.div
          key={currentService.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 p-6 sm:p-8 md:p-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              {/* Service Header */}
              <div className="mb-6 sm:mb-8">
                <motion.div
                  className="inline-flex items-center gap-2 sm:gap-3 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="h-[2px] w-8 sm:w-12 bg-red-600"></div>
                  <span className="text-xs sm:text-sm font-black italic tracking-widest uppercase text-red-600">
                    {currentService.subtitle}
                  </span>
                </motion.div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic text-black mb-4 sm:mb-6">
                  {currentService.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-lg">
                  {currentService.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {currentService.benefits.map((benefit, index) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50/30 transition-all"
                    >
                      <BenefitIcon size={20} className="text-red-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-gray-700">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-red-600 text-white font-black italic uppercase tracking-wider rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
                >
                  Get Estimate
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-black italic uppercase tracking-wider rounded-lg sm:rounded-xl text-xs sm:text-sm hover:bg-gray-800 transition-colors"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>

            {/* Right Icon Display */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 flex items-center justify-center`}
              >
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${currentService.accentColor} 0%, transparent 70%)`,
                  }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 sm:inset-10 md:inset-12 rounded-full border-2 border-dashed"
                  style={{ borderColor: currentService.accentColor + "40" }}
                />
                <CurrentIcon
                  size={80}
                  className="relative z-10"
                  style={{ color: currentService.accentColor }}
                  strokeWidth={1.5}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
