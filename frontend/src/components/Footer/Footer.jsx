"use client";

import { useState, useEffect } from "react";
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
        confirmButtonColor: "#D28042",
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
        text:
          res.data.message ||
          "You have successfully subscribed to our newsletter.",
        icon: "success",
        confirmButtonColor: "#D28042",
      });

      setEmail("");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#D28042",
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

  const quickLinks = [
    { name: "Home", href: "/" },
    // { name: "Services", href: "/services" },
    { name: "Lifetime Strategy", href: "/lifetime-strategy" },
    { name: "About Founders", href: "/about-founders" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  // const policies = [
  //   { name: "Terms & Conditions", href: "/terms" },
  //   { name: "Privacy Policy", href: "/privacy" },
  //   { name: "Refund Policy", href: "/refund" },
  // ];

  const quicklinks = [
    { name: "Planning = Wealth", href: "/why-retirement-planning" },
    { name: "Time = Wealth", href: "/why-start-early" },
    { name: "Why RetireWell", href: "/why-choose-us" },
    { name: "Questionnaire", href: "/questionnaire" },
  ];

  const socialLinks = [
    {
      icon: <FaYoutube />,
      href: "https://www.youtube.com/@Retirewellindiaofficial",
      name: "Youtube",
    },
    {
      icon: <FaFacebookF />,
      href: "https://www.facebook.com/profile.php?id=61583495368426",
      name: "Facebook",
    },
    {
      icon: <FaInstagram />,
      href: "https://www.instagram.com/retirewellindia",
      name: "Instagram",
    },
  ];

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Gradient background accents */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-[#D28042]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#D28042]/10 rounded-full blur-3xl"></div>

        {/* Main Footer Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start">
              <img
                src={logo}
                alt="Retire Well India Logo"
                className="h-14 mb-6"
              />
              <p className="text-gray-300 mb-6 leading-relaxed text-center md:text-left max-w-sm">
                Helping young Indians secure a wealthy and stress-free
                retirement. Start early, invest wisely, and retire rich.
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-3 h-3 text-white" />
                  </div>
                  <a
                    href="mailto:support@retirewellindia.com"
                    className="text-gray-300 hover:text-orange-500 transition"
                  >
                    support@retirewellindia.com
                  </a>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <FaPhone className="w-3 h-3 text-white" />
                  </div>
                  <a
                    href="https://wa.me/919876543210"
                    className="text-gray-300 hover:text-orange-500 transition"
                  >
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-start justify-center md:justify-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mt-0.5">
                    <FaMapMarkerAlt className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-300">Mumbai, Chennai, Delhi</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-6 text-orange-500">
                Quick Links
              </h3>
              <ul className="space-y-3 text-center md:text-left">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-orange-500 transition-all duration-200 flex items-center justify-center md:justify-start group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#D28042] rounded-full mr-3 group-hover:w-2 transition-all"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-6 text-orange-500">
                Quick Links
              </h3>
              <ul className="space-y-3 text-center md:text-left">
                {quicklinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-orange-500 transition-all duration-200 flex items-center justify-center md:justify-start group"
                    >
                      <span className="w-1.5 h-1.5 bg-[#D28042] rounded-full mr-3 group-hover:w-2 transition-all"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-lg font-semibold mb-6 text-orange-500">
                Stay Updated
              </h3>
              <p className="text-sm text-gray-300 mb-4 text-center md:text-left">
                Get financial insights, saving strategies, and retirement
                planning tips right in your inbox.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="w-full mb-6">
                <div className="relative mb-4">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-gray-500/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D28042] transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-md hover:bg-[#b76d33] transform hover:scale-105 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>

              {/* Social Links */}
              <div>
                <h4 className="text-orange-500 font-semibold mb-3 text-center md:text-left">
                  Follow Us
                </h4>
                <div className="flex items-center justify-center md:justify-start space-x-3">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:bg-[#b76d33] hover:scale-110 transition"
                      aria-label={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {/* <div className="relative border-t border-[#D28042]/30 bg-[#1e324d]">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-300 space-y-4 md:space-y-0">
            <span>© 2025 Retire Well India. All Rights Reserved.</span>
            <div className="flex space-x-4">
              {policies.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="hover:text-orange-500 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div> */}

        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 z-50"
          >
            <FaArrowUp className="w-5 h-5" />
          </button>
        )}
      </footer>
    </>
  );
};

export default Footer;
