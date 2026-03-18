import React from 'react';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import { 
  Truck, ClipboardCheck, History, MapPin, 
  User, CheckCircle, Clock, AlertCircle 
} from 'lucide-react';

const VendorStaffDashboard = () => {
  const sidebarItems = [
    { icon: ClipboardCheck, label: 'My Assignments', path: '/dashboard/vendor-staff' },
    { icon: Truck, label: 'Vehicle Management', path: '/dashboard/vendor-staff/fleet' },
    { icon: History, label: 'Trip History', path: '/dashboard/vendor-staff/history' },
    { icon: User, label: 'My Documents', path: '/dashboard/vendor-staff/docs' },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Field Staff">
      <div className="space-y-8">
        <DashboardGrid>
          <StatCard title="Active Trips" value="03" icon={Truck} trend={0} color="orange" />
          <StatCard title="Completed Today" value="08" icon={CheckCircle} trend={25} color="green" />
          <StatCard title="Pending Docs" value="02" icon={ClipboardCheck} trend={-50} color="red" />
          <StatCard title="Total Distance" value="1,240 km" icon={MapPin} trend={12} color="slate" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
              Current Trip Details
            </h3>
            
            <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Truck size={120} />
              </div>
              <div className="relative z-10 flex flex-wrap justify-between items-start gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Active Assignment</p>
                    <h4 className="text-2xl font-black italic tracking-tighter">TRIP #2948-AX</h4>
                  </div>
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Loading</p>
                      <p className="font-bold">Mumbai Port</p>
                    </div>
                    <div className="w-8 h-[1px] bg-slate-700"></div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Destination</p>
                      <p className="font-bold">Indore Hub</p>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="px-4 py-2 bg-orange-500 rounded-xl font-black italic uppercase text-[10px] mb-4">In Transit</div>
                  <p className="text-sm font-medium text-slate-300">ETA: Today, 8:30 PM</p>
                </div>
              </div>
              <div className="mt-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Recent Reports</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Delivery Confirmation</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Completed • 2h ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 hover:bg-white hover:border-orange-500 hover:text-orange-500 transition-all group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <AlertCircle size={24} />
              </div>
              <span className="font-black italic uppercase text-xs tracking-widest">Report Incident</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorStaffDashboard;
