import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, X, ArrowRight } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Specific logic for light/dark theme depending on page
    const isAboutPage = location.pathname === '/about';
    const isContactPage = location.pathname === '/contact';
    const isLocationsPage = location.pathname === '/locations';
    const isPTLEstimationPage = location.pathname === '/ptl-estimate';
    const isBookingSummaryPage = location.pathname === '/booking-summary';
    const isDashboardPage = location.pathname === '/dashboard';
    const isStaticPage = isAboutPage || isContactPage || isLocationsPage || isPTLEstimationPage || isBookingSummaryPage || isDashboardPage;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Shop', href: '/#shop' },
        { name: 'Packaging Solutions', href: '/#solutions' },
        { name: 'About Us', href: '/about' },
        { name: 'Locations', href: '/locations' },
        { name: 'Resources', href: '/#resources' },
        { name: 'Contact Us', href: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled || isStaticPage
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm py-3'
            : 'bg-black/5 backdrop-blur-[2px] border-b border-white/10 py-5'}`}>
            <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between transition-all duration-300">

                {/* Logo & Main Nav */}
                <div className="flex items-center gap-12 lg:gap-16">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <img
                                src={logoImg}
                                alt="Dot2Dotz Logo"
                                className="w-12 h-12 object-contain transform group-hover:rotate-[-12deg] transition-transform duration-500"
                            />
                            {(!scrolled && !isStaticPage) && <div className="absolute inset-0 bg-white/20 blur-xl rounded-full -z-10 animate-pulse"></div>}
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className={`text-2xl font-black tracking-tight italic transition-all duration-300 ${scrolled || isStaticPage ? 'text-black' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'}`}>Dot2Dotz</span>
                            <span className="text-[10px] font-black text-red-600 tracking-[0.2em] uppercase italic">Connecting The World</span>
                        </div>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`relative text-[13px] font-bold transition-all duration-300 group italic tracking-wide ${scrolled || isStaticPage ? 'text-gray-600 hover:text-black' : 'text-white/90 hover:text-white'}`}
                            >
                                <span className="relative z-10">{link.name}</span>
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                                {(!scrolled && !isStaticPage) && <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 blur-md -z-10 transition-all rounded-lg"></span>}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Secondary Action - Desktop */}
                    <Link to="/#track" className={`hidden md:flex items-center gap-2 text-[13px] font-bold transition-all mr-4 group ${scrolled || isStaticPage ? 'text-gray-700 hover:text-black' : 'text-white/90 hover:text-white'}`}>
                        <div className={`p-2 rounded-lg transition-colors ${scrolled || isStaticPage ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-white/10 group-hover:bg-white/20'}`}>
                            <FileText size={16} className={`transition-colors ${scrolled || isStaticPage ? 'text-gray-600 group-hover:text-black' : 'text-white'}`} />
                        </div>
                        <span>Track Shipment</span>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        <button className={`hidden sm:block text-[13px] font-bold transition-colors px-2 ${scrolled ? 'text-gray-500 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                            Login
                        </button>
                        <button className={`flex items-center gap-3 text-[13px] font-black py-3 px-7 rounded-full transition-all group shadow-xl uppercase tracking-wider italic ${scrolled
                            ? 'bg-black text-white hover:bg-red-600 shadow-black/10 hover:shadow-red-600/20'
                            : 'bg-red-600 text-white hover:bg-white hover:text-red-600 shadow-red-600/20 hover:shadow-white/20'}`}>
                            Sign Up
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-xl transition-all ${scrolled
                                ? 'bg-gray-100 hover:bg-gray-200 text-black shadow-sm'
                                : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a href="#track" className="flex items-center gap-2 text-lg font-bold text-black pt-2">
                        <FileText size={20} />
                        <span>Track Shipment</span>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
