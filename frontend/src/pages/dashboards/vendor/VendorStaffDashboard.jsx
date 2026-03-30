import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import { 
  Truck, ClipboardCheck, History, MapPin, 
  User, CheckCircle, Clock, AlertCircle,
  ArrowRight, Navigation, Zap
} from 'lucide-react';

const VendorStaffDashboard = () => {
  const sidebarItems = [
    { icon: ClipboardCheck, label: 'My Assignments', path: '/dashboard/vendor-staff' },
    { icon: Truck, label: 'Vehicle Management', path: '/dashboard/vendor/fleet' },
    { icon: History, label: 'Trip History', path: '/dashboard/vendor-staff/history' },
    { icon: User, label: 'My Documents', path: '/dashboard/vendor-staff/docs' },
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
    <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Field Staff">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8 max-w-7xl mx-auto pb-12"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Field Operations</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2 font-medium">
              <Navigation size={16} className="text-orange-600" />
              Real-time fleet and assignment tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-slate-900 rounded-2xl text-white flex items-center gap-3 shadow-lg shadow-slate-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-black uppercase tracking-widest">Active Duty</span>
            </div>
          </div>
        </div>

        <DashboardGrid>
          <StatCard title="Active Trips" value="03" icon={Truck} trend={0} color="orange" />
          <StatCard title="Completed Today" value="08" icon={CheckCircle} trend={25} color="green" />
          <StatCard title="Efficiency" value="94%" icon={Zap} trend={5} color="amber" />
          <StatCard title="Total Distance" value="1,240 km" icon={MapPin} trend={12} color="slate" />
        </DashboardGrid>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 pb-4 flex items-center justify-between">
                <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-3 text-slate-900">
                  <span className="w-2 h-6 bg-orange-600 rounded-full"></span>
                  Priority Assignment
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing</span>
              </div>
              
              <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group m-2">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Truck size={140} />
                </div>
                <div className="relative z-10 flex flex-wrap justify-between items-start gap-8">
                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Trip Identifier</p>
                      <h4 className="text-3xl font-black italic tracking-tighter text-white">#2948-AX-FTL</h4>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="relative pl-6 border-l-2 border-orange-500/30">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-orange-500 rounded-full"></div>
                        <p className="text-[10px] font-black uppercase text-slate-500 leading-none mb-1">Origin</p>
                        <p className="font-bold text-lg">Mumbai Port</p>
                      </div>
                      <div className="w-12 h-[1px] bg-slate-700"></div>
                      <div className="relative pl-6 border-l-2 border-slate-700">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 bg-slate-400 rounded-full"></div>
                        <p className="text-[10px] font-black uppercase text-slate-500 leading-none mb-1">Destination</p>
                        <p className="font-bold text-lg">Indore Hub</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="px-4 py-2 bg-orange-600 rounded-xl font-black italic uppercase text-[10px] mb-4 shadow-lg shadow-orange-900/20 tracking-widest">
                      In Transit
                    </div>
                    <p className="text-sm font-medium text-slate-400">ETA: <span className="text-white font-bold">Today, 8:30 PM</span></p>
                  </div>
                </div>
                <div className="mt-12 space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Current Progress</span>
                    <span className="text-sm font-black italic text-orange-500">65%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-lg shadow-orange-500/20"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">Vehicle Status</h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors">Manage Fleet</button>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { plate: 'MH-01-AX-9921', vehicle: 'Tata Prima 4028.S', status: 'On Road' },
                  { plate: 'MH-04-BT-1120', vehicle: 'Eicher Pro 6037', status: 'Loading' }
                ].map((v, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <Truck size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{v.plate}</p>
                        <p className="font-bold text-slate-900">{v.vehicle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        v.status === 'On Road' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {v.status}
                      </span>
                      <ArrowRight size={18} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              variants={itemVariants}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-slate-900">Recent Reports</h3>
                <Clock size={18} className="text-slate-400" />
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all border border-transparent group-hover:border-orange-100">
                      <ClipboardCheck size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none mb-1">Delivery Confirmed</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">TRIP #29{i}4 • 2h ago</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-[1.5rem] font-black italic uppercase text-[10px] tracking-widest transition-all">
                Full History
              </button>
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: 'white', borderColor: '#ea580c', color: '#ea580c' }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 transition-all group shadow-sm hover:shadow-orange-100"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform border border-slate-100">
                <AlertCircle size={28} />
              </div>
              <span className="font-black italic uppercase text-xs tracking-widest leading-none">Report Incident</span>
              <p className="text-[10px] font-medium mt-2 opacity-60">Instant support team notification</p>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default VendorStaffDashboard;

