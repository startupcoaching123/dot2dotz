import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
  Package, Plus, Search, MapPin, FileText,
  History, User, HelpCircle, ArrowRight,
  TrendingUp, CreditCard, Clock, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ClientOwnerDashboard = () => {
  const { user } = useAuth();

  const sidebarItems = [
    { icon: Package, label: 'Overview', path: '/dashboard/client' },
    { icon: FileText, label: 'Leads', path: '/dashboard/client/leads' },
    { icon: Plus, label: 'New Shipment', path: '/dashboard/client/new' },
    { icon: Clock, label: 'Active Tracking', path: '/dashboard/client/track' },
    { icon: History, label: 'Shipment History', path: '/dashboard/client/history' },
    { icon: CreditCard, label: 'Billing & Invoices', path: '/dashboard/client/billing' },
    { icon: User, label: 'Team Management', path: '/dashboard/client/team' },
  ];

  const recentShipments = [
    { id: 'FTL-8821', goods: 'Electronic Components', from: 'Mumbai', to: 'Bangalore', status: 'In Transit', progress: 65, date: '2 hours ago' },
    { id: 'FTL-8819', goods: 'Industrial Machinery', from: 'Pune', to: 'Chennai', status: 'Delayed', progress: 40, date: '5 hours ago' },
    { id: 'FTL-8815', goods: 'Pharma Supplies', from: 'Ahmedabad', to: 'Hyderabad', status: 'Delivered', progress: 100, date: 'Yesterday' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Owner">
      <div className="space-y-10 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-black tracking-tight text-slate-900 uppercase italic"
            >
              Master <span className="text-blue-600">Control</span>
            </motion.h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Enterprise Operations • {user?.companyName || 'Corporate Client'}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                placeholder="Track Shipment ID..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-wider focus:outline-none focus:border-blue-500 transition-all w-64 shadow-sm"
              />
            </div>
            <Link 
              to="/dashboard/client/new" 
              className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" />
              New Booking
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardGrid>
          <StatCard title="Active Loads" value="08" icon={Package} trend={12} color="blue" />
          <StatCard title="Total Spent" value="₹ 4.2L" icon={CreditCard} trend={8} color="green" />
          <StatCard title="Avg Transit" value="38 hrs" icon={Clock} trend={-5} color="orange" />
          <StatCard title="On-time Rate" value="96.4%" icon={CheckCircle2} trend={2} color="indigo" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Active Shipments Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-10 overflow-hidden relative">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Live Shipments</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time status of your active freight</p>
                </div>
                <button className="px-6 py-2.5 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-blue-600 hover:bg-blue-50 transition-all">View Analytics</button>
              </div>

              <div className="space-y-6">
                {recentShipments.map((shipment, idx) => (
                  <motion.div 
                    key={shipment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group cursor-pointer"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform group-hover:shadow-blue-100 group-hover:border-blue-100">
                          <Package size={28} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{shipment.goods}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{shipment.id} • {shipment.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-center px-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                          <p className="text-xs font-black text-slate-900 mt-1">{shipment.from}</p>
                        </div>
                        <div className="flex flex-col items-center px-2">
                          <div className="w-12 h-px bg-slate-200 relative">
                             <ArrowRight size={12} className="absolute left-1/2 -top-1.5 -translate-x-1/2 text-slate-300" />
                          </div>
                        </div>
                        <div className="text-center px-4">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                          <p className="text-xs font-black text-slate-900 mt-1">{shipment.to}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                              shipment.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-100' : 
                              shipment.status === 'Delayed' ? 'bg-red-50 text-red-600 border-red-100' : 
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {shipment.status}
                            </span>
                         </div>
                         <button className="w-12 h-12 bg-white rounded-2xl border border-slate-100 text-slate-300 group-hover:text-blue-600 group-hover:border-blue-100 transition-all flex items-center justify-center shadow-sm">
                            <ChevronRight size={20} />
                         </button>
                      </div>
                    </div>

                    {/* Progress Bar for Active Shipments */}
                    {shipment.status !== 'Delivered' && (
                       <div className="mt-8 space-y-2">
                          <div className="flex justify-between items-center">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transit Progress</p>
                             <p className="text-[10px] font-black text-blue-600">{shipment.progress}%</p>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${shipment.progress}%` }}
                               transition={{ duration: 1.5, ease: "easeOut" }}
                               className="h-full bg-blue-600 rounded-full relative overflow-hidden shadow-lg shadow-blue-200"
                             >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
                             </motion.div>
                          </div>
                       </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-10">
            {/* Quick Actions Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl transition-transform group-hover:scale-125" />
              <TrendingUp className="text-blue-400 mb-6 scale-150 origin-left" size={32} />
              <h3 className="text-2xl font-black tracking-tight mb-4 uppercase italic">Market <span className="text-blue-400">Insights</span></h3>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-10 uppercase tracking-wider">
                Current demand for MH-DL route is up by 15%. Consider booking in advance for better rates.
              </p>
              <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">Analyze Routes</button>
            </div>

            {/* Tracking Support Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-100/50">
              <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                 <MapPin className="text-blue-600" size={20} />
                 Terminal Finder
              </h3>
              <div className="space-y-6">
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-blue-200 hover:bg-white transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Closest Terminal</p>
                    <p className="text-xs font-black text-slate-800">Navi Mumbai Hub - 4.2 km</p>
                 </div>
                 <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-blue-200 hover:bg-white transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Hours</p>
                    <p className="text-xs font-black text-slate-800 italic">24/7 Service Active</p>
                 </div>
                 <button className="w-full py-4 text-blue-600 font-black uppercase text-[9px] tracking-widest hover:underline">Find All Hub Locations</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default ClientOwnerDashboard;
