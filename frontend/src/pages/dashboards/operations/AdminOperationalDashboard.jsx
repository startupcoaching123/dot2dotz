import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
  Truck, MapPin, Navigation, Package,
  Clock, AlertTriangle, CheckCircle2, MoreHorizontal
} from 'lucide-react';

const AdminOperationalDashboard = () => {
  const sidebarItems = [
    { icon: Navigation, label: 'Live Tracking', path: '/dashboard/admin-operational' },
    { icon: Truck, label: 'Fleet Management', path: '/dashboard/admin-operational/fleet' },
    { icon: Package, label: 'Dispatch Center', path: '/dashboard/admin-operational/dispatch' },
    { icon: Clock, label: 'Schedule', path: '/dashboard/admin-operational/schedule' },
    { icon: AlertTriangle, label: 'Incidents', path: '/dashboard/admin-operational/incidents' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Operational Admin">
      <div className="space-y-8">
        <DashboardGrid>
          <StatCard title="Active Shipments" value="342" icon={Navigation} trend={8} color="blue" />
          <StatCard title="On-Time Delivery" value="94.2%" icon={CheckCircle2} trend={2.4} color="green" />
          <StatCard title="Fleet Utilization" value="87%" icon={Truck} trend={-4} color="orange" />
          <StatCard title="Pending Pickups" value="18" icon={Clock} trend={15} color="red" />
        </DashboardGrid>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1.5 h-6 bg-red-600 rounded-full"></span>
                Real-Time Network Status
              </h3>
              <p className="text-sm text-slate-400 font-medium">Monitoring 24 regions across India</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Filter</button>
              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-200">Expand Map</button>
            </div>
          </div>
          <div className="h-96 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <MapPin size={200} className="text-slate-900" />
            </div>
            <div className="text-center relative z-10 space-y-4">
              <div className="flex animate-pulse justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-200"></div>
              </div>
              <p className="font-bold text-slate-400 italic tracking-[0.2em] uppercase text-xs">Live Interactive Map Loading...</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-black rounded-full"></span>
              Dispatch Queue
            </h3>
            <button className="text-slate-400 hover:text-black transition-colors"><MoreHorizontal /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Shipment ID</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Route</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map(i => (
                  <tr key={i} className="group hover:bg-slate-50 transition-all">
                    <td className="py-4 font-bold text-sm">#ORD-2024-{1024 + i}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">DEL</span>
                        <div className="w-8 h-[1px] bg-slate-200"></div>
                        <span className="text-xs font-bold">MUM</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">In Transit</span>
                    </td>
                    <td className="py-4 text-xs font-bold text-slate-500">TATA-407-202{i}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminOperationalDashboard;
