import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send, ChevronRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="relative bg-[#1a1a1a] pt-32 pb-12 overflow-hidden">
            {/* Speed-Theme Angled Divider */}
            <div className="absolute top-0 left-0 w-full h-32 bg-white -translate-y-16 skew-y-[-3deg] z-10"></div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

                    {/* Brand Section */}
                    <div className="col-span-1 lg:col-span-1 space-y-8">
                        <a href="/" className="flex items-center gap-3 group">
                            <img
                                src={logoImg}
                                alt="Dot2Dotz Logo"
                                className="w-14 h-14 object-contain transform group-hover:skew-x-[-12deg] transition-transform duration-300 brightness-0 invert"
                            />
                            <div className="flex flex-col leading-none">
                                <span className="text-2xl font-black tracking-tight text-white italic">Dot2Dotz</span>
                                <span className="text-[10px] font-black text-red-600 tracking-[0.2em] uppercase italic">Connecting The World</span>
                            </div>
                        </a>
                        <p className="text-gray-400 font-bold italic text-sm leading-relaxed max-w-xs">
                            Redefining logistics with luxury service standards for both enterprise and personal needs.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 hover:skew-x-[-10deg] transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="col-span-1">
                        <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-red-600"></span>
                            Quick Links
                        </h4>
                        <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                            {['Home', 'Blog', 'Company', 'Services', 'Partnerships', 'Newsroom'].map((link) => (
                                <li key={link}>
                                    <a href="#" className="group flex items-center gap-2 text-gray-400 hover:text-white font-bold italic text-sm transition-colors">
                                        <ChevronRight size={14} className="text-red-600 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0" />
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="col-span-1">
                        <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-red-600"></span>
                            Contact Us
                        </h4>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-gray-400">
                                <MapPin size={20} className="text-red-600 shrink-0" />
                                <span className="text-sm font-bold italic leading-snug">3015 Grand Ave, Coconut Grove, Merrick Way, FL 12345</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Phone size={20} className="text-red-600 shrink-0" />
                                <span className="text-sm font-bold italic">+91 87449 87441</span>
                            </li>
                            <li className="flex items-center gap-4 text-gray-400">
                                <Mail size={20} className="text-red-600 shrink-0" />
                                <span className="text-sm font-bold italic">sales@dot2dotz.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Subscribe Section */}
                    <div className="col-span-1">
                        <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-8 flex items-center gap-2">
                            <span className="w-4 h-0.5 bg-red-600"></span>
                            Remain Updated
                        </h4>
                        <div className="space-y-6">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="w-full bg-[#252525] border-none rounded-xl py-4 px-6 text-white text-sm font-bold italic placeholder:text-gray-600 focus:ring-2 focus:ring-red-600 transition-all"
                                />
                            </div>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest py-4 rounded-xl transition-all transform hover:skew-x-[-6deg] hover:translate-y-[-4px] shadow-lg shadow-red-600/20 active:scale-95">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 font-black italic text-[10px] uppercase tracking-[0.3em]">
                        © 2024 DOT2DOTZ LOGISTICS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map((item) => (
                            <a key={item} href="#" className="text-gray-500 hover:text-white font-black italic text-[10px] uppercase tracking-widest transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Light Speed Effect */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600/20 to-transparent"></div>
        </footer>
    );
};

export default Footer;
