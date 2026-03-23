import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import { 
  Plus, Package, Truck, Search, 
  MapPin, Clock, Calendar, FilePlus, UserCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientStaffDashboard = () => {
  const sidebarItems = [
    { icon: FilePlus, label: 'Create Order', path: '/dashboard/client-staff' },
    { icon: Package, label: 'My Bookings', path: '/dashboard/client-staff/bookings' },
    { icon: Search, label: 'Track Shipment', path: '/dashboard/client-staff/track' },
    { icon: MapPin, label: 'Address Book', path: '/dashboard/client-staff/addresses' },
    { icon: UserCircle, label: 'Profile Settings', path: '/dashboard/client/profile' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Operations Staff">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-blue-600 p-6 rounded-xl text-white flex flex-col items-center text-center shadow-sm">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                   <Plus size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">New Booking</h3>
                <p className="text-blue-100 text-sm mb-6">Instantly create a new shipment request</p>
                <Link to="/dashboard/client-staff/new" className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors block text-center">
                  Start Now
                </Link>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-sm text-slate-700 mb-4">Staff Quick Stats</h4>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Daily Bookings</span>
                        <span className="text-lg font-semibold text-slate-900">14</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Pending Docs</span>
                        <span className="text-lg font-semibold text-red-600">03</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 border-l-4 border-blue-600 pl-3">
                    In-Progress Orders
                </h3>
             </div>
             <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
                                <Truck size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-500">Order #FF-882{i}</p>
                                <p className="text-sm font-semibold text-slate-900 mt-0.5">Consignee: Retail Pro India</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-orange-500" />
                                <span className="text-xs font-medium text-slate-600">Pick-up Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-600">Oct 24, 2024</span>
                            </div>
                        </div>
                        <button className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors text-center">
                            Update
                        </button>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientStaffDashboard;
