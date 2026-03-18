import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaYoutube,
  FaArrowUp,
  FaLinkedinIn
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpeg";

const BACKENDURL = import.meta.env.VITE_BACKEND_URL;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        icon: "warning",
        confirmButtonColor: "#DC2626",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BACKENDURL}/api/newsletter/subscribe`, {
        email: email.trim(),
      });

      Swal.fire({
        title: "Subscribed!",
        text: res.data.message || "You have successfully subscribed to our newsletter.",
        icon: "success",
        confirmButtonColor: "#DC2626",
      });

      setEmail("");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const footerLinks = {
    company: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Services", href: "/#services" },
      { name: "Contact Us", href: "/contact" },
    ],
    services: [
      { name: "Full Truck Load", href: "/services/full-load" },
      { name: "Partial Truck Load", href: "/services/partial-load" },
      { name: "Shared Load", href: "/services/shared-load" },
      { name: "Tracking", href: "/#track" },
    ],
    support: [
      { name: "FAQs", href: "/#faq" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
    ]
  };

  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", name: "Facebook" },
    { icon: <FaInstagram />, href: "#", name: "Instagram" },
    { icon: <FaLinkedinIn />, href: "#", name: "LinkedIn" },
    { icon: <FaYoutube />, href: "#", name: "Youtube" },
  ];

  return (
    <footer className="bg-slate-900 pt-20 pb-10 text-slate-300 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand & Contact */}
          <div className="lg:col-span-4 space-y-8">
            <img src={logo} alt="Dot2Dotz Logo" className="h-14 brightness-110" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              Your trusted partner in seamless logistics. We connect businesses with reliable shipping solutions across India, ensuring speed, safety, and transparency.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Email Us</p>
                  <a href="mailto:support@dot2dotz.com" className="text-sm font-bold text-slate-200 group-hover:text-red-500 transition-colors">support@dot2dotz.com</a>
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <FaPhone size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Call Support</p>
                  <a href="tel:+918744987441" className="text-sm font-bold text-slate-200 group-hover:text-red-500 transition-colors">+91 87449 87441</a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-lg tracking-tight">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm font-medium hover:text-red-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-lg tracking-tight">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm font-medium hover:text-red-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg tracking-tight">Newsletter</h4>
              <p className="text-slate-400 text-sm font-medium">Get the latest logistics insights and updates.</p>
              <form onSubmit={handleNewsletterSubmit} className="relative max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-4 pl-6 pr-32 text-sm text-slate-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-red-600 text-white px-6 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {loading ? "..." : "Subscribe"}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">Connect With Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] font-medium text-slate-500">
          <p>&copy; {new Date().getFullYear()} Dot2Dotz Logistics Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            {footerLinks.support.map((link) => (
              <Link key={link.name} to={link.href} className="hover:text-red-500 transition-colors">{link.name}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll To Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-2xl hover:bg-red-700 hover:scale-110 transition-all z-[100]"
        >
          <FaArrowUp size={18} />
        </button>
      )}

      <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
            .font-sans {
                font-family: 'Poppins', sans-serif;
            }
        `}</style>
    </footer>
  );
};

export default Footer;
