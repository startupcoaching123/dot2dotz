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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 leading-tight">Welcome Back!</h2>
            <p className="text-sm text-slate-500 mt-1">You have 3 shipments arriving today.</p>
          </div>
          <Link to="/dashboard/client/new" className="flex w-full sm:w-auto items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={18} />
            New Booking
          </Link>
        </div>

        <DashboardGrid>
          <StatCard title="Active Shipments" value="12" icon={Package} trend={15} color="blue" />
          <StatCard title="Delivered" value="148" icon={Package} trend={5} color="green" />
          <StatCard title="Total Spent" value="₹ 84,200" icon={History} trend={10} color="indigo" />
          <StatCard title="Saved Addresses" value="8" icon={MapPin} trend={0} color="slate" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Shipments
                </h3>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="group p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Wooden Pallets (x4)</p>
                        <p className="text-xs text-slate-500 mt-0.5">#FF-2024-{832 + i} • Full Load</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="text-left sm:text-center w-full sm:w-auto flex-1">
                        <p className="text-xs text-slate-400">From</p>
                        <p className="text-sm font-medium text-slate-700">Delhi</p>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 hidden sm:block" />
                      <div className="text-right sm:text-center w-full sm:w-auto flex-1">
                        <p className="text-xs text-slate-400">To</p>
                        <p className="text-sm font-medium text-slate-700">Mumbai</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex justify-end">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">Processing</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-6 rounded-xl text-white relative overflow-hidden flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <HelpCircle size={24} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-slate-400 text-sm mb-6">Our customer support is available 24/7 to help you with your bookings and shipments.</p>
              <button className="w-full py-2.5 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors">Contact Support</button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Tracking Center</h3>
              <div className="relative">
                <input placeholder="Enter Shipment ID..." className="w-full pl-4 pr-12 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-slate-400" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Search size={18} />
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
