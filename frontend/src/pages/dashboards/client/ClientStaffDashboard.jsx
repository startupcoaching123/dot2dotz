import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import { 
  Plus, Package, Truck, Search, 
  MapPin, Clock, Calendar, FilePlus 
} from 'lucide-react';

const ClientStaffDashboard = () => {
  const sidebarItems = [
    { icon: FilePlus, label: 'Create Order', path: '/dashboard/client-staff' },
    { icon: Package, label: 'My Bookings', path: '/dashboard/client-staff/bookings' },
    { icon: Search, label: 'Track Shipment', path: '/dashboard/client-staff/track' },
    { icon: MapPin, label: 'Address Book', path: '/dashboard/client-staff/addresses' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Client Operations Staff">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-red-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-md">
                   <Plus size={32} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">New Booking</h3>
                <p className="text-red-100 text-sm mb-8 font-medium">Instantly create a new shipment request</p>
                <button className="w-full py-4 bg-white text-red-600 rounded-[1.5rem] font-black italic uppercase text-sm hover:bg-black hover:text-white transition-all tracking-widest shadow-lg">Start Now</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="font-black italic text-xs uppercase text-slate-400 tracking-widest mb-6">Staff Quick Stats</h4>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-600">Daily Bookings</span>
                        <span className="text-lg font-black italic">14</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-600">Pending Docs</span>
                        <span className="text-lg font-black italic text-red-600">03</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-black rounded-full"></span>
                    In-Progress Orders
                </h3>
             </div>
             <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-wrap items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                                <Truck size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black italic uppercase text-slate-400">Order #FF-882{i}</p>
                                <p className="text-sm font-bold">Consignee: Retail Pro India</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-orange-500" />
                                <span className="text-xs font-bold">Pick-up Pending</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-slate-400" />
                                <span className="text-xs font-bold">Oct 24, 2024</span>
                            </div>
                        </div>
                        <button className="text-[10px] font-black uppercase text-slate-900 hover:text-red-600 tracking-widest">Update</button>
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
