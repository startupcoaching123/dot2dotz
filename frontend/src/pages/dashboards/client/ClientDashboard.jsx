import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
  Package, Plus, Search, MapPin,
  History, User, HelpCircle, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const sidebarItems = [
    { icon: Package, label: 'My Shipments', path: '/dashboard/client' },
    { icon: Plus, label: 'New Booking', path: '/dashboard/client/new' },
    { icon: Search, label: 'Track Order', path: '/dashboard/client/track' },
    { icon: History, label: 'Booking History', path: '/dashboard/client/history' },
    { icon: User, label: 'Profile Settings', path: '/dashboard/client/profile' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Dashboard">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">Welcome Back!</h2>
            <p className="text-slate-500 font-medium mt-1">You have 3 shipments arriving today.</p>
          </div>
          <Link to="/dashboard/client/new" className="hidden sm:flex items-center gap-3 bg-red-600 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-wider text-[10px] hover:bg-slate-900 transition-all shadow-sm">
            <Plus size={18} />
            New Booking
          </Link>
        </div>

        <DashboardGrid>
          <StatCard title="Active Shipments" value="12" icon={Package} trend={15} color="red" />
          <StatCard title="Delivered" value="148" icon={Package} trend={5} color="green" />
          <StatCard title="Total Spent" value="₹ 84,200" icon={History} trend={10} color="blue" />
          <StatCard title="Saved Addresses" value="8" icon={MapPin} trend={0} color="slate" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                  <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                  Recent Shipments
                </h3>
                <button className="text-[10px] font-semibold uppercase text-slate-500 hover:text-red-600 tracking-wider">View All</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="group p-6 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all flex flex-wrap items-center justify-between gap-6 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-red-600 shadow-sm transition-colors border border-slate-50">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Wooden Pallets (x4)</p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">#FF-2024-{832 + i} • Full Load</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">From</p>
                        <p className="text-xs font-bold text-slate-700 mt-1">Delhi</p>
                      </div>
                      <ArrowRight size={14} className="text-slate-200 mx-1" />
                      <div className="text-center">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">To</p>
                        <p className="text-xs font-bold text-slate-700 mt-1">Mumbai</p>
                      </div>
                    </div>
                    <div>
                      <span className="px-4 py-1.5 bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-wider rounded-lg group-hover:border-red-600/20 group-hover:text-red-600 transition-all">Processing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:rotate-12 transition-transform">
                <HelpCircle size={100} />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10 tracking-tight">Need Help?</h3>
              <p className="text-slate-400 text-sm mb-10 relative z-10 font-medium leading-relaxed">Our customer support is available 24/7 to help you with your bookings and shipments.</p>
              <button className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-red-600 hover:text-white transition-all relative z-10 shadow-sm">Contact Support</button>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Tracking Center</h3>
              <div className="relative">
                <input placeholder="Enter Shipment ID..." className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-all outline-none" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
