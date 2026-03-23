"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, ChevronRight, LogOut, LayoutDashboard, Truck, Package } from "lucide-react";
import logo from "../../assets/logo.jpeg";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState({});
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  const [activeLoginDropdown, setActiveLoginDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { id: 1, title: "Home", path: "/" },
    {
      id: 2,
      title: "Services",
      subItems: [
        { id: "2-1", title: "Full Load", path: "/services/full-load", icon: <Truck size={18} />, description: "Complete truck for large cargo" },
        { id: "2-2", title: "Partial Load", path: "/services/partial-load", icon: <Package size={18} />, description: "Cost-effective shared transport" },
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  const getDashboardPath = () => {
    const roleDashboardMap = {
      'SUPER_ADMIN': '/dashboard/super-admin',
      'ADMIN_OPERATIONAL': '/dashboard/admin-operational',
      'ADMIN_FINANCE': '/dashboard/admin-finance',
      'CLIENT': '/dashboard/client',
      'CLIENT_OWNER': '/dashboard/client',
      'VENDOR': '/dashboard/vendor',
      'VENDOR_OWNER': '/dashboard/vendor',
      'CLIENT_STAFF': '/dashboard/client-staff',
      'VENDOR_STAFF': '/dashboard/vendor-staff',
    };
    const userRole = (user?.role || user?.userType || "").toUpperCase();
    return roleDashboardMap[userRole] || "/dashboard";
  };

  const isTransparent = location.pathname === '/' && !isScrolled;
  const textColorClass = isTransparent ? "text-white hover:text-red-500" : "text-slate-800 hover:text-red-600";
  const borderColorClass = isTransparent ? "border-white/30 text-white hover:bg-white hover:text-black" : "border-slate-800 text-slate-800 hover:bg-slate-900 hover:text-white";

  return (
    <>
      {/* Top Loading Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-500 animate-pulse z-[60]" />
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-2"
          : location.pathname === '/'
            ? "bg-transparent py-4"
            : "bg-white py-2"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Aligned to left */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Retire Well India Logo" className="h-12 w-auto" />
            </Link>

            {/* Desktop Nav Links - Now in the center with flex-1 */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-4 mx-4">
              {navItems.map((item) => (
                <div key={item.id} className="relative dropdown-container">
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => toggleDesktopDropdown(item.id)}
                        className={`dropdown-button flex items-center px-2 py-2 font-medium transition text-sm ${textColorClass}`}
                      >
                        {item.title}
                        <ChevronDown
                          className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeDesktopDropdown === item.id ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      {activeDesktopDropdown === item.id && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 w-80 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 z-50 animate-fadeIn overflow-hidden">
                          <div className="p-2">
                            {item.subItems.map((sub) => (
                              <Link
                                key={sub.id}
                                to={sub.path}
                                className="flex items-start gap-4 p-4 text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                                onClick={() => setActiveDesktopDropdown(null)}
                              >
                                <div className="mt-1 p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                                  {sub.icon}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-sm tracking-tight">{sub.title}</span>
                                  {sub.description && (
                                    <span className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">{sub.description}</span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="bg-slate-50 p-4 border-t border-slate-100">
                             <Link to="/contact" className="text-xs font-bold text-slate-900 flex items-center gap-2 hover:text-red-600 transition-colors">
                               Contact for Custom Solutions <ChevronRight size={14} />
                             </Link>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`px-2 py-2 font-medium transition text-sm ${textColorClass}`}
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
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <Link
                    to={getDashboardPath()}
                    className={`flex items-center gap-2 px-5 py-2 font-semibold transition ${textColorClass}`}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-5 py-2 text-red-600 hover:text-red-700 font-semibold transition"
                  >
                    <LogOut size={18} />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="relative login-dropdown-container">
                    <button
                      onClick={() => setActiveLoginDropdown(!activeLoginDropdown)}
                      className={`login-dropdown-button flex items-center px-5 py-2 font-semibold transition ${textColorClass}`}
                    >
                      Login
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform duration-200 ${activeLoginDropdown ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {activeLoginDropdown && (
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl ring-1 ring-gray-200 z-50 animate-fadeIn">
                        <div className="py-2">
                          {[
                            { path: '/login/super-admin', label: 'Super Admin' },
                            { path: '/login/admin-operational', label: 'Operational Admin' },
                            { path: '/login/admin-finance', label: 'Finance Admin' },
                            { path: '/login/client', label: 'Client Owner' },
                            { path: '/login/client-staff', label: 'Client Staff' },
                            { path: '/login/vendor', label: 'Vendor Owner' },
                            { path: '/login/vendor-staff', label: 'Vendor Staff' },
                          ].map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className="block px-4 py-2.5 text-gray-700 hover:text-red-600 hover:bg-[#F7F7F7] transition text-sm font-medium"
                              onClick={() => setActiveLoginDropdown(false)}
                            >
                              Login as {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/signup"
                    className={`px-5 py-2 border-2 font-semibold rounded-full transition ${borderColorClass}`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  // setIsModalOpen(true);
                  setActiveDesktopDropdown(null);
                }}
                className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition-all duration-300 text-sm whitespace-nowrap"
              >
                Track Shipment
              </button>
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-md transition ${textColorClass}`}
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
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <img src={logo} alt="Logo" className="h-15 w-auto" />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-md">
              <X className="w-6 h-6 text-slate-800" />
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
                          <ChevronUp className="w-5 h-5 text-red-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-red-600" />
                        )}
                      </button>
                      {mobileDropdowns[item.id] && (
                        <div className="ml-4 mb-2 space-y-1 bg-[#F8FAFC] rounded-lg p-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={subItem.path}
                              className="block px-4 py-3 text-slate-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileDropdowns({});
                              }}
                            >
                              <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 mr-2 text-red-600" />
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
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center justify-between w-full p-4 text-[#253F5E] font-medium hover:bg-slate-50 transition rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={20} className="text-red-600" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400" />
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full p-4 text-red-600 font-medium hover:bg-red-50 transition rounded-lg"
                >
                  <LogOut size={20} />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setMobileDropdowns(prev => ({ ...prev, login: !prev.login }))}
                    className="flex items-center justify-between w-full p-4 text-[#253F5E] font-medium hover:bg-gradient-to-r from-orange-500 to-orange-600/10 transition"
                  >
                    <span>Login</span>
                    {mobileDropdowns.login ? (
                      <ChevronUp className="w-5 h-5 text-red-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-red-600" />
                    )}
                  </button>
                  {mobileDropdowns.login && (
                    <div className="ml-4 mb-2 space-y-1 bg-slate-50 rounded-lg p-2">
                      {[
                        { path: '/login/super-admin', label: 'Super Admin' },
                        { path: '/login/admin-operational', label: 'Operational Admin' },
                        { path: '/login/admin-finance', label: 'Finance Admin' },
                        { path: '/login/client', label: 'Client Owner' },
                        { path: '/login/client-staff', label: 'Client Staff' },
                        { path: '/login/vendor', label: 'Vendor Owner' },
                        { path: '/login/vendor-staff', label: 'Vendor Staff' },
                      ].map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-3 text-slate-800 hover:text-red-600 hover:bg-red-50 rounded-lg transition text-sm"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileDropdowns({});
                          }}
                        >
                          <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 mr-2 text-red-600" />
                            Login as {item.label}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  to="/signup"
                  className="block w-full text-center px-5 py-2 border-2 border-slate-800 text-slate-800 font-semibold rounded-full hover:bg-slate-900 hover:text-white transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <button className="block w-full text-center bg-slate-900 text-white py-3 rounded-full font-semibold hover:bg-red-600 transition">
              Track Shipment
            </button>
          </div>
        </div>
      </div>

      {/* Spacer - only show when not on home page or already scrolled */}
      {location.pathname !== '/' && <div className="h-16" />}
    </>
  );
};

export default Navbar;