import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
  Plus, Package, Truck, Search,
  MapPin, Clock, Calendar, FilePlus, UserCircle,
  ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientStaffDashboard = () => {
  const sidebarItems = [
    { icon: FilePlus, label: 'Create Order', path: '/dashboard/client-staff' },
    { icon: Package, label: 'My Bookings', path: '/dashboard/client/leads' },
    { icon: Search, label: 'Track Shipment', path: '/dashboard/client/track' },
    { icon: MapPin, label: 'Address Book', path: '/dashboard/client-staff/addresses' },
    { icon: UserCircle, label: 'Profile Settings', path: '/dashboard/client/profile' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Operations Staff">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 max-w-7xl mx-auto pb-12"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Dashboard</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-500" />
              Manage your daily logistics operations efficiently
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
              <p className="text-sm font-bold text-green-500 flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Operational
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardGrid>
          <StatCard title="Total Bookings" value="124" icon={Package} trend={12} color="blue" />
          <StatCard title="Active Shipments" value="18" icon={Truck} trend={5} color="indigo" />
          <StatCard title="Pending Docs" value="03" icon={FilePlus} trend={-2} color="red" />
          <StatCard title="Success Rate" value="98.4%" icon={Zap} trend={0.5} color="amber" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Action Side */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-700 to-indigo-800 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-blue-200"
            >
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Truck size={180} />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-xl border border-white/30">
                  <Plus size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">New Booking</h3>
                <p className="text-blue-100/80 text-sm mb-8 leading-relaxed">
                  Start a new shipment request. Our optimized routing will find you the best price.
                </p>
                <Link 
                  to="/ftl-estimate" 
                  className="w-full py-4 bg-white text-blue-700 rounded-2xl font-bold text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Start Estimation <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
            >
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                Performance Overview
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-500">Target Achievement</span>
                    <span className="text-sm font-bold text-slate-900">82%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Avg Response</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">14m</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cust. Rating</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">4.9/5</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Side */}
          <div className="lg:col-span-8">
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  Recent Operations
                </h3>
                <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                  View All
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div 
                    key={i} 
                    whileHover={{ backgroundColor: 'rgb(248, 250, 252)' }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                        <Truck size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black text-slate-500 rounded uppercase tracking-tighter">ID: FF-882{i}</span>
                          <span className="text-xs text-slate-400 font-medium">• Oct {20+i}, 2024</span>
                        </div>
                        <p className="text-base font-bold text-slate-900">Reliance Digital Warehouse</p>
                        <p className="text-sm text-slate-500">Route: Mumbai → Pune</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="flex flex-col items-end">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          i % 2 === 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {i % 2 === 0 ? 'In Transit' : 'Scheduled'}
                        </span>
                        <p className="text-xs font-bold text-slate-400 mt-1">Exp. Delivery: Tomorrow</p>
                      </div>
                      <button className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 hover:shadow-sm transition-all group">
                        <ArrowRight size={20} className="text-slate-400 group-hover:text-blue-600" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ClientStaffDashboard;

