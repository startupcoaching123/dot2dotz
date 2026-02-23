import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Truck, Shield, Navigation, ArrowUpRight, Search } from 'lucide-react';
import officeImg from '../assets/office.jpeg';
import officeLookImg from '../assets/office_look.jpeg';

const LocationsPage = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const representativeCities = [
        "Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Hyderabad", "Chennai", "Kolkata", "Pune",
        "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Patna", "Indore", "Thane",
        "Bhopal", "Visakhapatnam", "Vadodara", "Firozabad", "Ludhiana", "Rajkot", "Agra", "Siliguri",
        "Nashik", "Faridabad", "Patiala", "Meerut", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar",
        "Dhanbad", "Jodhpur", "Amritsar", "Raipur", "Allahabad", "Coimbatore", "Jabalpur", "Gwalior",
        "Vijayawada", "Madurai", "Guwahati", "Chandigarh", "Hubli-Dharwad", "Amroha", "Moradabad", "Gurgaon",
        "Aligarh", "Solapur", "Ranchi", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Warangal",
        "Mira-Bhayandar", "Thiruvananthapuram", "Bhiwandi", "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida",
        "Jamshedpur", "Bhilai Nagar", "Cuttack", "Kochi", "Udaipur", "Bhavnagar", "Dehradun", "Asansol",
        "Nanded-Waghala", "Ajmer", "Jamnagar", "Ujjain", "Sangli", "Loni", "Jhansi", "Pondicherry",
        "Nellore", "Jammu", "Belgaum", "Rourkela", "Mangalore", "Tirunelveli", "Malegaon", "Gaya",
        "Tiruppur", "Davanagere", "Kozhikode", "Akola", "Kurnool", "Bokaro Steel City", "Rajahmundry", "Ballari",
        "Agartala", "Bhagalpur", "Latur", "Dhule", "Korba", "Bhilwara", "Brahmapur", "Mysore",
        "Muzaffarpur", "Ahmednagar", "Kollam", "Raghunathganj", "Bilaspur", "Shahjahanpur", "Thrissur", "Alwar",
        "Kakinada", "Nizamabad", "Sagar", "Tumkur", "Hisar", "Rohtak", "Panipat", "Darbhanga",
        "Kharagpur", "Aizawl", "Ichalkaranji", "Tirupati", "Karnal", "Bathinda", "Rampur", "Shivamogga",
        "Ratlam", "Modinagar", "Durg", "Shillong", "Imphal", "Hapur", "Ranipet", "Anantapur",
        "Arrah", "Karimnagar", "Parbhani", "Etawah", "Bharatpur", "Begusarai", "New Delhi", "Chhapra",
        "Kadapa", "Ramagundam", "Pali", "Satna", "Vizianagaram", "Katihar", "Haridwar", "Sonipat"
    ];

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-red-600 selection:text-white pt-20">
            {/* Hero Section */}
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1512411176212-652f75439401?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Global Logistics Network"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Speed Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]"></div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.8)]"
                            ></motion.div>
                            <span className="text-white/60 font-black italic tracking-[0.4em] uppercase text-xs">Live Network Status</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-[1000] italic text-white leading-none tracking-tighter mb-6 uppercase">
                            GLOBAL <span className="text-red-600">REACH.</span>
                        </h1>
                        <p className="text-white/40 text-lg font-medium tracking-[0.2em] italic uppercase max-w-2xl mx-auto">
                            Serving 500+ Cities with Rapid Deployment Logistics
                        </p>
                    </motion.div>
                </div>

                {/* Road Lines Effect */}
                <div className="absolute bottom-10 left-0 w-full flex justify-around opacity-20 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 h-20 bg-white skew-x-[-30deg]"></div>
                    ))}
                </div>
            </div>

            {/* Introduction Section */}
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-24">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7"
                    >
                        <div className="inline-flex items-center gap-3 mb-8 bg-red-600/5 px-4 py-2 rounded-full border border-red-600/10">
                            <Navigation size={14} className="text-red-600" />
                            <span className="text-red-600 font-black italic tracking-widest uppercase text-[10px]">Seamless Operations</span>
                        </div>
                        <h2 className="text-5xl font-black italic text-black leading-[1.1] mb-10 tracking-tight">
                            Transportation Service on <br />
                            <span className="text-red-600">Different Locations.</span>
                        </h2>

                        <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed italic">
                            <p className="border-l-4 border-red-600 pl-8">
                                We are providing the service from different locations and we can provide the variety of trucks to your choose locations.
                            </p>
                            <p className="text-xl font-[1000] text-black uppercase tracking-tight leading-tight">
                                Searching for problem-free transportation service at entirely reasonable costs?
                            </p>
                            <p>
                                At Dot2Dotz, we offer an extensive variety of truck transport services. Whether you really want to ship a huge burden or a little shipment, we have an answer that will address your issues.
                            </p>
                            <p className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 text-sm not-italic font-bold leading-relaxed">
                                We have an armada of very much kept-up trucks prepared to deal with a wide range of freight, and coordinated operations, and our group of experienced drivers will guarantee that your shipment shows up securely and on time.
                                We are connected with <span className="text-red-600 underline">500+ drivers</span> to deliver and we can provide you a multi-type trucks for transportation for the long routes such as <span className="italic">Bangalore to Guwahati, Pune to Coimbatore, Kolkata to Indore</span> and so on.
                            </p>
                            <p className="text-base text-gray-500 not-italic">
                                We are also providing the Door Delivery/Door Pickup service, truck rental service, parcel service, and comprehensive point-to-point logistics.
                            </p>
                        </div>

                        {/* Stats Rail */}
                        <div className="grid grid-cols-3 gap-8 mt-16 pb-12 border-b border-gray-100">
                            <div>
                                <h4 className="text-4xl font-[1000] italic text-black mb-1">500+</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Drivers</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-[1000] italic text-red-600 mb-1">100%</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">On-Time Goal</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-[1000] italic text-black mb-1">24/7</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rapid Support</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Office Imagery */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                            className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]"
                        >
                            <img src={officeImg} alt="Dot2Dotz Corporate Office" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8">
                                <p className="text-white font-[1000] italic uppercase tracking-tighter text-2xl">Main HQ</p>
                                <p className="text-red-500 font-black italic uppercase tracking-widest text-[10px]">New Delhi Hub</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50, y: 50 }}
                            whileInView={{ opacity: 1, x: 0, y: 0 }}
                            className="absolute -bottom-10 -left-20 w-80 h-64 z-20 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white -rotate-6 hidden xl:block"
                        >
                            <img src={officeLookImg} alt="Office Interior" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-red-600/10 group-hover:bg-transparent transition-colors"></div>
                        </motion.div>

                        {/* Decorative Gradient */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-600/5 rounded-full blur-[100px] -z-10"></div>
                    </div>
                </div>
            </div>

            {/* Cities Network Section */}
            <div className="bg-black py-32 relative overflow-hidden">
                {/* Speed Background */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600 animate-[scroll_10s_linear_infinite]"></div>
                    <div className="absolute top-1/4 left-0 w-full h-[1px] bg-red-600 animate-[scroll_8s_linear_infinite_reverse]"></div>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-600 animate-[scroll_12s_linear_infinite]"></div>
                    <div className="absolute top-3/4 left-0 w-full h-[1px] bg-red-600 animate-[scroll_15s_linear_infinite_reverse]"></div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-[2px] w-12 bg-red-600"></div>
                                <span className="text-red-500 font-black italic tracking-[0.3em] uppercase text-sm">Active Hubs</span>
                            </div>
                            <h3 className="text-5xl lg:text-7xl font-[1000] italic text-white leading-none uppercase tracking-tighter">
                                Major <span className="text-red-600 underline decoration-white/20 underline-offset-[12px]">Service Areas.</span>
                            </h3>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="text-white/40 font-bold italic text-lg max-w-md ml-auto uppercase tracking-wider">
                                Top areas where we frequently offer our rapid truck booking services:
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {representativeCities.slice(0, 40).map((city, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: (idx % 20) * 0.02 }}
                                className="group relative"
                            >
                                <div className="bg-white/5 border border-white/10 hover:border-red-600/50 hover:bg-white/10 p-4 md:p-6 rounded-2xl transition-all duration-300 overflow-hidden">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span className="text-white/80 group-hover:text-white font-bold italic tracking-wide text-sm md:text-base transition-colors">
                                                Delhi to {city}
                                            </span>
                                        </div>
                                        <ArrowUpRight size={14} className="text-white/20 group-hover:text-red-600 transition-colors" />
                                    </div>
                                    {/* Speed Line Accent */}
                                    <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-red-600 group-hover:w-full transition-all duration-500"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* State-wise Coverage Grid - NEW SECTION */}
            <div className="py-32 bg-gray-50 overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
                    <div className="mb-20">
                        <h3 className="text-4xl lg:text-5xl font-black italic text-black uppercase tracking-tight mb-4">
                            Strategic <span className="text-red-600">State-wise Hubs</span>
                        </h3>
                        <p className="text-gray-500 font-bold italic tracking-widest uppercase text-xs">Full Coverage across the subcontinent</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-[3rem] overflow-hidden shadow-2xl">
                        {[
                            "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
                            "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
                            "Mizoram", "Nagaland", "Odisha", "Punjab",
                            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
                            "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
                        ].map((state, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ backgroundColor: '#fff' }}
                                className="bg-white/80 p-10 flex flex-col items-center justify-center text-center group transition-colors"
                            >
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 group-hover:text-red-600 transition-colors">State Network</p>
                                <h4 className="text-xl font-[1000] italic text-black uppercase tracking-tighter leading-none mb-6 group-hover:scale-110 transition-transform">
                                    {state}
                                </h4>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-300 uppercase italic tracking-widest">All Cities Available</p>
                                    <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity italic">Live Tracking Active</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Final Map Section */}
            <div className="h-[600px] relative w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3498.11956554581!2d77.1469!3d28.747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d021000000001%3A0x6b87648356f17e2e!2sSanjay%20Gandhi%20Transport%20Nagar%2C%20Delhi%2C%20110042!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Road texture overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.1)_100%)]"></div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scroll {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}} />
        </div>
    );
};

export default LocationsPage;
