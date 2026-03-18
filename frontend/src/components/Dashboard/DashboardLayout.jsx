import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, Bell, User, LogOut,
  ChevronRight, LayoutDashboard
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children, sidebarItems, roleName }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-30 hidden lg:flex flex-col
          ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight text-slate-900">Dot2Dotz</span>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative
                ${location.pathname === item.path
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'group-hover:text-slate-900'} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              {!isSidebarOpen && (
                <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg lg:flex hidden"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{roleName}</h1>
              <p className="text-lg font-semibold text-slate-900">Overview</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl group focus-within:ring-2 ring-slate-200 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-40 lg:w-64"
              />
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'John Doe'}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-white z-50 lg:hidden flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-slate-900">Dot2Dotz</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {sidebarItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                      ${location.pathname === item.path
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button
                onClick={logout}
                className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all mt-auto"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
