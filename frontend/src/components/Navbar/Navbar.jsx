"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import logo from "../../assets/logo.jpeg";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  const [activeLoginDropdown, setActiveLoginDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 1, title: "Home", path: "/" },
    {
      id: 2,
      title: "Services",
      subItems: [
        { id: "2-1", title: "Full Load", path: "/services/full-load" },
        { id: "2-2", title: "Partial Load", path: "/services/partial-load" },
      ]
    },
    { id: 3, title: "About Us", path: "/about" },
    { id: 4, title: "Contact Us", path: "/contact" }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-container') && !e.target.closest('.dropdown-button')) {
        setActiveDesktopDropdown(null);
      }
      if (!e.target.closest('.login-dropdown-container') && !e.target.closest('.login-dropdown-button')) {
        setActiveLoginDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setActiveDesktopDropdown(null);
    setMobileDropdowns({});
    setActiveLoginDropdown(false);
  }, [location.pathname]);

  // Navbar scroll shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading bar on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const toggleMobileDropdown = (id) => {
    setMobileDropdowns(prev => ({
      [id]: !prev[id]
    }));
  };

  const toggleDesktopDropdown = (id) => {
    setActiveDesktopDropdown(activeDesktopDropdown === id ? null : id);
  };

  return (
    <>
      {/* Top Loading Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF8800] via-[#FF7600] to-[#FF6A00] animate-pulse z-[60]" />
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Aligned to left */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Retire Well India Logo" className="h-12 w-auto" />
            </Link>

            {/* Desktop Nav Links - Now in the center with flex-1 */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-0 mx-4">
              {navItems.map((item) => (
                <div key={item.id} className="relative dropdown-container">
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleDesktopDropdown(item.id)}
                        className="dropdown-button flex items-center px-2 py-2 text-[#253F5E] font-medium hover:text-[#D28042] transition text-sm"
                      >
                        {item.title}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                            activeDesktopDropdown === item.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeDesktopDropdown === item.id && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 z-50 animate-fadeIn">
                          <div className="py-2">
                            {item.subItems.map((sub) => (
                              <Link
                                key={sub.id}
                                to={sub.path}
                                className="block px-4 py-3 text-gray-700 hover:text-[#D28042] hover:bg-[#F7F7F7] transition text-sm"
                                onClick={() => setActiveDesktopDropdown(null)}
                              >
                                {sub.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="px-2 py-2 text-[#253F5E] hover:text-[#D28042] font-medium transition text-sm"
                      onClick={() => setActiveDesktopDropdown(null)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button (Desktop) - Aligned to right */}
            <div className="hidden md:flex items-center gap-4 -mr-6">
              <div className="relative login-dropdown-container">
                <button
                  onClick={() => setActiveLoginDropdown(!activeLoginDropdown)}
                  className="login-dropdown-button flex items-center px-5 py-2 text-[#253F5E] font-semibold hover:text-[#D28042] transition"
                >
                  Login
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      activeLoginDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeLoginDropdown && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 z-50 animate-fadeIn">
                    <div className="py-2">
                      <Link
                        to="/login/client-ftl"
                        className="block px-4 py-3 text-gray-700 hover:text-[#D28042] hover:bg-[#F7F7F7] transition text-sm"
                        onClick={() => setActiveLoginDropdown(false)}
                      >
                        Login as Client FTL
                      </Link>
                      <Link
                        to="/login/client-ptl"
                        className="block px-4 py-3 text-gray-700 hover:text-[#D28042] hover:bg-[#F7F7F7] transition text-sm"
                        onClick={() => setActiveLoginDropdown(false)}
                      >
                        Login as Client PTL
                      </Link>
                      <Link
                        to="/login/vendor"
                        className="block px-4 py-3 text-gray-700 hover:text-[#D28042] hover:bg-[#F7F7F7] transition text-sm"
                        onClick={() => setActiveLoginDropdown(false)}
                      >
                        Login as Vendor
                      </Link>
                      <Link
                        to="/login/admin"
                        className="block px-4 py-3 text-gray-700 hover:text-[#D28042] hover:bg-[#F7F7F7] transition text-sm"
                        onClick={() => setActiveLoginDropdown(false)}
                      >
                        Login as Admin
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link
                to="/signup"
                className="px-5 py-2 border-2 border-[#253F5E] text-[#253F5E] font-semibold rounded-full hover:bg-[#253F5E] hover:text-white transition"
              >
                Sign Up
              </Link>
              <button
                onClick={() => {
                  // setIsModalOpen(true);
                  setActiveDesktopDropdown(null);
                }}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-[#b56d35] transition-all duration-300 text-sm whitespace-nowrap"
              >
                Track Shipment
              </button>
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#253F5E] rounded-md hover:bg-gray-100 transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src={logo} alt="Logo" className="h-15 w-auto" />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-md">
              <X className="w-6 h-6 text-[#253F5E]" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-4">
              {navItems.map((item) => (
                <div key={item.id} className="border-b border-gray-100 last:border-0">
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(item.id)}
                        className="flex items-center justify-between w-full p-4 text-[#253F5E] font-medium hover:bg-gradient-to-r from-orange-500 to-orange-600/10 transition"
                      >
                        <span>{item.title}</span>
                        {mobileDropdowns[item.id] ? (
                          <ChevronUp className="w-5 h-5 text-[#D28042]" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#D28042]" />
                        )}
                      </button>
                      {mobileDropdowns[item.id] && (
                        <div className="ml-4 mb-2 space-y-1 bg-[#F8FAFC] rounded-lg p-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={subItem.path}
                              className="block px-4 py-3 text-[#253F5E] hover:text-[#D28042] hover:bg-[#D28042]/10 rounded-lg transition text-sm"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileDropdowns({});
                              }}
                            >
                              <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 mr-2 text-[#D28042]" />
                                {subItem.title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="block p-4 text-[#253F5E] hover:text-[#D28042] hover:bg-[#D28042]/10 rounded-lg transition font-medium"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileDropdowns({});
                      }}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* CTA Button (Mobile Footer) */}
          <div className="p-6 border-t border-gray-100 space-y-3">
            <div className="border-b border-gray-200">
              <button
                onClick={() => setMobileDropdowns(prev => ({ ...prev, login: !prev.login }))}
                className="flex items-center justify-between w-full p-4 text-[#253F5E] font-medium hover:bg-gradient-to-r from-orange-500 to-orange-600/10 transition"
              >
                <span>Login</span>
                {mobileDropdowns.login ? (
                  <ChevronUp className="w-5 h-5 text-[#D28042]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#D28042]" />
                )}
              </button>
              {mobileDropdowns.login && (
                <div className="ml-4 mb-2 space-y-1 bg-[#F8FAFC] rounded-lg p-2">
                  <Link
                    to="/login/client-ftl"
                    className="block px-4 py-3 text-[#253F5E] hover:text-[#D28042] hover:bg-[#D28042]/10 rounded-lg transition text-sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDropdowns({});
                    }}
                  >
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-[#D28042]" />
                      Login as Client FTL
                    </div>
                  </Link>
                  <Link
                    to="/login/client-ptl"
                    className="block px-4 py-3 text-[#253F5E] hover:text-[#D28042] hover:bg-[#D28042]/10 rounded-lg transition text-sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDropdowns({});
                    }}
                  >
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-[#D28042]" />
                      Login as Client PTL
                    </div>
                  </Link>
                  <Link
                    to="/login/vendor"
                    className="block px-4 py-3 text-[#253F5E] hover:text-[#D28042] hover:bg-[#D28042]/10 rounded-lg transition text-sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDropdowns({});
                    }}
                  >
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-[#D28042]" />
                      Login as Vendor
                    </div>
                  </Link>
                  <Link
                    to="/login/admin"
                    className="block px-4 py-3 text-[#253F5E] hover:text-[#D28042] hover:bg-[#D28042]/10 rounded-lg transition text-sm"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileDropdowns({});
                    }}
                  >
                    <div className="flex items-center">
                      <ChevronRight className="w-4 h-4 mr-2 text-[#D28042]" />
                      Login as Admin
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/signup"
              className="block w-full text-center px-5 py-2 border-2 border-[#253F5E] text-[#253F5E] font-semibold rounded-full hover:bg-[#253F5E] hover:text-white transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
            <button className="block w-full text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-full font-semibold hover:bg-[#b56d35] transition">
              Track Shipment
            </button>
          </div>
        </div>
      </div>
      
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;