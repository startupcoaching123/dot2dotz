import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageSquare, User, AtSign, Tag } from 'lucide-react';

const ContactPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const contactDetails = {
        address: "CW-541 First-Floor, Sanjay Gandhi Transport Nagar, New Delhi-110042",
        emails: ["order.dot2dotz@gmail.com", "info@dot2dotz.com"],
        phones: ["+91 87449 87441", "+91 87449 87442", "+91 87449 87443", "+91 87449 87445", "+91 95403 00619"]
    };

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-red-600 selection:text-white pt-20">
            {/* Hero Section */}
            <div className="relative h-[45vh] flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 opacity-50">
                    <img
                        src="https://images.pexels.com/photos/32908009/pexels-photo-32908009.jpeg?cs=srgb&dl=pexels-saqlain-ashraf-clicks-2425782-32908009.jpg&fm=jpg"
                        alt="Contact Dot2Dotz"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-9xl font-[1000] italic text-white leading-none tracking-tighter mb-4 uppercase">
                            Connect <span className="text-red-600">Now.</span>
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[2px] w-12 bg-red-600"></div>
                            <p className="text-white/80 text-lg font-black tracking-[0.3em] italic uppercase">Rapid Response Logistics</p>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Speed Lines */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse"></div>
            </div>

            {/* Main Contact Area */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
                <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">

                    {/* Left Side: Dynamic Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:col-span-12 xl:col-span-7"
                    >
                        <div className="mb-12">
                            <h2 className="text-4xl font-black italic text-black uppercase tracking-tight mb-4">
                                Send a <span className="text-red-600">Message</span>
                            </h2>
                            <p className="text-gray-500 font-medium italic">Our tracking experts are ready to assist you in real-time.</p>
                        </div>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Name Input */}
                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <User size={12} className="text-red-600" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold italic placeholder:not-italic focus:outline-none focus:border-red-600 focus:bg-white transition-all transition-duration-300"
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="space-y-2 group">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <AtSign size={12} className="text-red-600" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold italic placeholder:not-italic focus:outline-none focus:border-red-600 focus:bg-white transition-all transition-duration-300"
                                    />
                                </div>
                            </div>

                            {/* Subject Input */}
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Tag size={12} className="text-red-600" />
                                    Department / Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. FTL Inquiry, Tracking Help..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold italic placeholder:not-italic focus:outline-none focus:border-red-600 focus:bg-white transition-all transition-duration-300"
                                />
                            </div>

                            {/* Message Input */}
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MessageSquare size={12} className="text-red-600" />
                                    Your Requirement
                                </label>
                                <textarea
                                    rows="6"
                                    placeholder="Describe your transportation needs in detail..."
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold italic placeholder:not-italic focus:outline-none focus:border-red-600 focus:bg-white transition-all transition-duration-300 resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button className="group relative bg-black text-white px-12 py-5 rounded-2xl font-black italic uppercase tracking-widest overflow-hidden transition-all transform hover:skew-x-[-6deg] active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">
                                <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                <span className="relative z-10 flex items-center gap-3">
                                    Launch Message <Send size={18} />
                                </span>
                            </button>
                        </form>
                    </motion.div>

                    {/* Right Side: Speed Information Cards */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">

                        {/* Visit Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center rotate-[-6deg] group-hover:rotate-0 transition-transform">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-1">Corporate HQ</h4>
                                    <p className="text-2xl font-[1000] italic text-black uppercase tracking-tight">Visit Us</p>
                                </div>
                            </div>
                            <p className="text-gray-600 font-bold italic leading-relaxed text-lg">
                                {contactDetails.address}
                            </p>
                        </motion.div>

                        {/* Email Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-black p-10 rounded-[3rem] text-white relative group overflow-hidden shadow-2xl shadow-black/20"
                        >
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center rotate-[6deg] group-hover:rotate-0 transition-transform">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">24/7 Digital Support</h4>
                                    <p className="text-2xl font-[1000] italic text-red-600 uppercase tracking-tight">Mail Us</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {contactDetails.emails.map((email, idx) => (
                                    <a
                                        key={idx}
                                        href={`mailto:${email}`}
                                        className="block text-xl font-bold italic tracking-wide hover:text-red-500 transition-colors"
                                    >
                                        {email}
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Phone Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-10 rounded-[3rem] border-2 border-red-600/10 relative group overflow-hidden"
                        >
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center rotate-[-6deg] group-hover:rotate-0 transition-transform shadow-xl shadow-red-600/20">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] mb-1">Immediate Assistance</h4>
                                    <p className="text-2xl font-[1000] italic text-black uppercase tracking-tight">Call Now</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-4 gap-x-8">
                                {contactDetails.phones.map((phone, idx) => (
                                    <a
                                        key={idx}
                                        href={`tel:${phone.replace(/\s+/g, '')}`}
                                        className="text-lg font-black italic tracking-widest text-gray-800 hover:text-red-600 transition-colors flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                        {phone}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Final Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 rounded-[4rem] h-[500px] relative w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 border border-gray-100 shadow-2xl"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.11956554581!2d77.1469!3d28.747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d021000000001%3A0x6b87648356f17e2e!2sSanjay%20Gandhi%20Transport%20Nagar%2C%20Delhi%2C%20110042!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        className="w-full h-full border-0"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    {/* Road texture overlay - very subtle */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.05)_100%)]"></div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
