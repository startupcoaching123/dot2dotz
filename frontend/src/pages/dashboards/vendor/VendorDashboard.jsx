import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
    BarChart3, Truck, Users, LayoutDashboard,
    Search, Briefcase, Wallet, ChevronRight,
    MapPin, ShieldCheck, FileText, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import DriversList from '../../../components/Dashboard/DriversList';
import RoutesList from '../../../components/Dashboard/RoutesList';
import VehiclesList from '../../../components/Dashboard/VehiclesList';
import VendorLeadsList from '../../../components/Dashboard/VendorLeadsList';

const OnboardingGuide = ({ onStepClick }) => {
    const steps = [
        { id: 'vehicle', title: 'AddVehicle', icon: Truck },
        { id: 'driver', title: 'AddDriver', icon: Users },
        { id: 'route', title: 'AddRoute', icon: MapPin },
        { id: 'docs', title: 'VerifyDocs', icon: ShieldCheck },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 overflow-hidden relative">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 group">
                {/* Left Section: Info & Progress */}
                <div className="flex flex-col md:flex-row items-center gap-10 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 pb-10 lg:pb-0 lg:pr-10">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-xl font-bold text-slate-900 leading-tight max-w-[200px]">
                            Complete your setup to start receiving load bookings
                        </h3>
                        <p className="text-xs font-medium text-slate-500">
                            Finish the tasks below to activate your account leads
                        </p>
                    </div>

                    <div className="relative flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-orange-500 flex items-center justify-center translate-y-2">
                            <span className="text-xl font-bold text-slate-900">0%</span>
                        </div>
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mt-4">Progress</p>
                    </div>
                </div>

                {/* Right Section: Checkbox Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            onClick={() => onStepClick?.(step.id)}
                            className="p-6 bg-white rounded-xl border border-slate-100 hover:border-orange-500 transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 min-w-[140px] aspect-square group/card"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-lg border-2 border-slate-200 flex items-center justify-center group-hover/card:border-orange-500 transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-100 group-hover/card:bg-orange-500 transition-colors" />
                                </div>
                                <span className="font-semibold text-slate-900 text-sm">{step.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const WelcomeBanner = () => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50 transition-transform duration-700" />

            <div className="relative z-10 space-y-8 flex flex-col items-center">
                <div className="relative">
                    <div className="w-40 h-40 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform duration-500">
                        <Truck size={48} className="text-white transition-transform" />

                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 z-20">
                            <FileText size={24} className="text-white" />
                        </div>

                        <div className="absolute -bottom-4 -left-8 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 z-20 rotate-12">
                            <MapPin size={24} className="text-slate-900" />
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 uppercase">
                        Start by Adding Your <span className="text-orange-600 block sm:inline">Fleet Information</span>
                    </h2>
                    <p className="text-slate-500 font-semibold uppercase tracking-wider text-xs">
                        Add Vehicle, Driver and Route details to activate your account and receive FTL leads instantly
                    </p>
                </div>

                <button className="px-12 py-6 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider text-xs shadow-lg shadow-slate-200 hover:bg-orange-600 transition-all flex items-center gap-4 group">
                    Get Started Now
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const VendorDashboard = () => {
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('trips'); // trips, loads
    const [showDriversModal, setShowDriversModal] = useState(false);
    const [showRoutesModal, setShowRoutesModal] = useState(false);
    const [showVehiclesModal, setShowVehiclesModal] = useState(false);

    // Aggressively find the vendor ID
    const getVendorId = (v) => {
        if (!v) return null;
        const vendorSpecificKeys = ['vender_id', 'vendor_id', 'vendorId', 'venderId'];
        for (const key of vendorSpecificKeys) {
            if (v[key]) return v[key];
        }
        const wrappers = ['vendor', 'vender', 'user', 'data', 'profile'];
        for (const w of wrappers) {
            if (v[w] && typeof v[w] === 'object') {
                for (const key of vendorSpecificKeys) {
                    if (v[w][key]) return v[w][key];
                }
            }
        }
        const genericKeys = ['_id', 'id', 'userId', 'user_id'];
        for (const key of genericKeys) {
            if (v[key]) return v[key];
        }
        return null;
    };

    const vendorId = getVendorId(user);

    if (loading) {
        return (
            <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Verifying Credentials...</p>
                </div>
            </DashboardLayout>
        );
    }

    const handleStepClick = (stepId) => {
        if (stepId === 'driver') {
            setShowDriversModal(true);
        } else if (stepId === 'route') {
            setShowRoutesModal(true);
        } else if (stepId === 'vehicle') {
            setShowVehiclesModal(true);
        }
    };

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/vendor' },
        { icon: Briefcase, label: 'Available Loads', path: '/dashboard/vendor/loads' },
        { icon: Truck, label: 'Fleet Status', path: '/dashboard/vendor/fleet' },
        { icon: Users, label: 'Driver Mgmt', path: '/dashboard/vendor/drivers' },
        { icon: MapPin, label: 'Routes', path: '/dashboard/vendor/routes' },
        { icon: Wallet, label: 'Earnings', path: '/dashboard/vendor/earnings' },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
            <div className="space-y-12">
                <DashboardGrid>
                    <StatCard title="Total Fleet" value="28 Vehicles" icon={Truck} trend={5} color="orange" />
                    <StatCard title="Active Drivers" value="24" icon={Users} trend={2} color="blue" />
                    <StatCard title="Monthly Revenue" value="₹ 12.5L" icon={Wallet} trend={12} color="green" />
                    <StatCard title="Load Success" value="98%" icon={BarChart3} trend={1.5} color="slate" />
                </DashboardGrid>

                <OnboardingGuide onStepClick={handleStepClick} />

                <WelcomeBanner />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group hover:border-slate-300 transition-all">
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-orange-50 rounded-full opacity-50 transition-transform group-hover:scale-110"></div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
                            <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                            Quick Load Search
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider ml-1">Loading City</label>
                                <input placeholder="Ex: Mumbai" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm focus:bg-white focus:border-orange-500 transition-all outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider ml-1">Unloading City</label>
                                <input placeholder="Ex: Delhi" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-sm focus:bg-white focus:border-orange-500 transition-all outline-none" />
                            </div>
                            <button className="w-full py-5 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-orange-600 transition-all shadow-sm">Search Loads</button>
                        </div>
                    </div>
                    <div className="lg:col-span-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative hover:border-slate-300 transition-all">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                                <button
                                    onClick={() => setActiveTab('trips')}
                                    className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'trips' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Active Trips
                                </button>
                                <button
                                    onClick={() => setActiveTab('loads')}
                                    className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'loads' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    New Leads
                                </button>
                            </div>
                            <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-semibold uppercase text-slate-400 hover:text-slate-900 tracking-wider border border-slate-100 transition-all">Live Map View</button>
                        </div>
                        <div className="space-y-6">
                            {activeTab === 'trips' ? (
                                <>
                                    {[1, 2].map(i => (
                                        <div key={i} className="p-8 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:border-slate-100 transition-all flex flex-wrap items-center justify-between gap-8 group">
                                            {/* ... trip content ... */}
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm transition-transform">
                                                    <Truck size={28} className="text-orange-500" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold tracking-tight text-slate-900">MH-12-AX-{4821 + i}</p>
                                                    <div className="flex gap-4 items-center mt-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <Users size={12} className="text-slate-400" />
                                                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Arvind Singh</p>
                                                        </div>
                                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                        <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">In Transit</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 max-w-[250px] space-y-3">
                                                <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    <span>Mumbai</span>
                                                    <span className="text-orange-600">82%</span>
                                                    <span>Nagpur</span>
                                                </div>
                                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden p-0.5">
                                                    <div className="h-full bg-slate-900 w-[82%] rounded-full shadow-sm relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="w-12 h-12 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-white hover:bg-slate-900 transition-all flex items-center justify-center shadow-sm">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <VendorLeadsList title="Pending Assignments" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Drivers List Modal */}
            <AnimatePresence>
                {showDriversModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setShowDriversModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-slate-50 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Drivers Directory</h2>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Manage your active fleet personnel</p>
                                </div>
                                <button
                                    onClick={() => setShowDriversModal(false)}
                                    className="p-4 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all group"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {vendorId ? (
                                    <DriversList vendorId={vendorId} />
                                ) : (
                                    <div className="py-20 text-center bg-white rounded-xl border border-slate-100">
                                        <p className="text-red-500 font-bold uppercase text-xs italic">Unable to load drivers</p>
                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-2">Vendor ID not found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Routes List Modal */}
            <AnimatePresence>
                {showRoutesModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setShowRoutesModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-slate-50 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fleet Routes</h2>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Manage your vehicle transit paths</p>
                                </div>
                                <button
                                    onClick={() => setShowRoutesModal(false)}
                                    className="p-4 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all group"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {vendorId ? (
                                    <RoutesList vendorId={vendorId} vehicleId={1} />
                                ) : (
                                    <div className="py-20 text-center bg-white rounded-xl border border-slate-100">
                                        <p className="text-red-500 font-bold uppercase text-xs italic">Unable to load routes</p>
                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-2">Vendor ID not found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vehicles List Modal */}
            <AnimatePresence>
                {showVehiclesModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setShowVehiclesModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-slate-50 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fleet Vehicles</h2>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Manage your registered vehicles</p>
                                </div>
                                <button
                                    onClick={() => setShowVehiclesModal(false)}
                                    className="p-4 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all group"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {vendorId ? (
                                    <VehiclesList vendorId={vendorId} />
                                ) : (
                                    <div className="py-20 text-center bg-white rounded-xl border border-slate-100">
                                        <p className="text-red-500 font-bold uppercase text-xs italic">Unable to load vehicles</p>
                                        <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-2">Vendor ID not found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default VendorDashboard;
