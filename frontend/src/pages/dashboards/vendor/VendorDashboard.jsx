import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { StatCard, DashboardGrid } from '../../../components/Dashboard/DashboardUI';
import {
    BarChart3, Truck, Users, LayoutDashboard,
    Search, Briefcase, Wallet, ChevronRight,
    MapPin, ShieldCheck, FileText, ArrowRight, X
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { AUTH_ENDPOINTS } from '../../../api/endpoints';
import fetchWithAuth from '../../../FetchWithAuth';
import DriversList from '../../../components/Dashboard/DriversList';
import RoutesList from '../../../components/Dashboard/RoutesList';
import VehiclesList from '../../../components/Dashboard/VehiclesList';
import VendorLeadsList from '../../../components/Dashboard/VendorLeadsList';

const OnboardingGuide = ({ onStepClick, stats }) => {
    const hasVehicle = stats?.vehicles > 0;
    const hasDriver = stats?.drivers > 0;
    const hasRoute = stats?.routes > 0;

    // docs is usually tied to KYC but we'll mark as complete if any fleet is added for demo
    const hasDocs = stats?.vehicles > 0 && stats?.drivers > 0;

    const completedCount = [hasVehicle, hasDriver, hasRoute, hasDocs].filter(Boolean).length;
    const progress = completedCount * 25;

    const steps = [
        { id: 'vehicle', title: 'Add Vehicle', icon: Truck, completed: hasVehicle },
        { id: 'driver', title: 'Add Driver', icon: Users, completed: hasDriver },
        { id: 'route', title: 'Add Route', icon: MapPin, completed: hasRoute },
        { id: 'docs', title: 'Verify Docs', icon: ShieldCheck, completed: hasDocs },
    ];

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                {/* Left Section: Info & Progress */}
                <div className="flex items-center gap-8 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 pb-8 lg:pb-0 lg:pr-8">
                    <div className="relative flex flex-col items-center flex-shrink-0">
                        <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${progress === 100 ? 'border-green-500 text-green-600 bg-green-50' : progress > 0 ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-400'}`}>
                            <span className="text-xl font-semibold">{progress}%</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Setup Profile
                        </h3>
                        <p className="text-sm text-gray-500">
                            Complete these steps to activate your vendor account.
                        </p>
                    </div>
                </div>

                {/* Right Section: Checkbox Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 w-full">
                    {steps.map((step) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.id}
                                onClick={() => !step.completed && onStepClick?.(step.id)}
                                className={`p-5 rounded-xl border transition-all duration-200 flex flex-col items-start gap-4 ${step.completed
                                    ? 'bg-gray-50 border-gray-200 cursor-default'
                                    : 'bg-white border-gray-200 hover:border-gray-400 hover:shadow-sm cursor-pointer'
                                    }`}
                            >
                                <div className="flex justify-between items-start w-full">
                                    <div className={`p-2.5 rounded-lg ${step.completed ? 'bg-gray-200 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>
                                        <Icon size={20} strokeWidth={2} />
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${step.completed ? 'border-green-500 bg-green-500' : 'border-gray-300'
                                        }`}>
                                        {step.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                </div>

                                <p className={`text-sm font-medium ${step.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {step.title}
                                </p>
                            </div>
                        );
                    })}
                </div>
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
    const [statsTrigger, setStatsTrigger] = useState(0);

    const [setupStats, setSetupStats] = useState({
        vehicles: 0,
        drivers: 0,
        routes: 0,
        leads: 0
    });

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
                <div className="h-full min-h-[50vh] flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading Dashboard...</p>
                </div>
            </DashboardLayout>
        );
    }

    useEffect(() => {
        if (!vendorId) return;
        const fetchAllStats = async () => {
            const newStats = { vehicles: 0, drivers: 0, routes: 0, leads: 0 };
            let globalListV = [];

            try {
                const resV = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet`, { method: 'GET' });
                if (resV.ok) {
                    const dataV = await resV.json();
                    globalListV = dataV.data || dataV.vehicles || dataV.fleet || [];
                    if (Array.isArray(globalListV)) newStats.vehicles = globalListV.length;
                }
            } catch (err) { console.error(err); }

            try {
                const resD = await fetchWithAuth(`${AUTH_ENDPOINTS.VENDOR_DRIVERS(vendorId)}?active=true`, { method: 'GET' });
                if (resD.ok) {
                    const dataD = await resD.json();
                    const listD = dataD.data || dataD.drivers || dataD;
                    if (Array.isArray(listD)) newStats.drivers = listD.length;
                }
            } catch (err) { console.error(err); }

            let routesCount = 0;
            try {
                if (newStats.vehicles > 0 && Array.isArray(globalListV)) {
                    for (const fleet of globalListV) {
                        const fid = fleet.vendorVehiclesId || fleet.id || fleet._id || fleet.vehicle_id || fleet.vehicleId;
                        if (!fid) continue;
                        const res = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${fid}/routes`, { method: 'GET' });
                        if (res.ok) {
                            const rd = await res.json();
                            const routes = rd.data || rd.routes || [];
                            routesCount += Array.isArray(routes) ? routes.length : 0;
                        }
                    }
                }
            } catch(e) {}
            newStats.routes = routesCount;

            try {
                const resL = await fetchWithAuth(AUTH_ENDPOINTS.VENDOR_INCOMING_LEADS, { method: 'GET' });
                if (resL.ok) {
                    const dataL = await resL.json();
                    const listL = dataL.data || dataL.leads || dataL;
                    if (Array.isArray(listL)) newStats.leads = listL.length;
                }
            } catch (err) { console.error(err); }

            setSetupStats(newStats);
        };
        fetchAllStats();
    }, [vendorId, statsTrigger]);

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
            <div className="space-y-8 max-w-7xl mx-auto">
                <DashboardGrid>
                    <StatCard title="Total Fleet" value={setupStats.vehicles > 0 ? `${setupStats.vehicles} Vehicles` : "0 Vehicles"} icon={Truck} color="orange" />
                    <StatCard title="Active Drivers" value={setupStats.drivers || 0} icon={Users} color="blue" />
                    <StatCard title="Earnings (Mtd)" value="₹0" icon={Wallet} color="green" />
                    <StatCard title="Available Leads" value={setupStats.leads || 0} icon={Briefcase} color="slate" />
                </DashboardGrid>

                <OnboardingGuide onStepClick={handleStepClick} stats={setupStats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Search Panel */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
                        <h3 className="text-base font-semibold text-gray-900 mb-5">
                            Quick Search
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Origin</label>
                                <input placeholder="e.g. Mumbai" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1.5">Destination</label>
                                <input placeholder="e.g. Delhi" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors outline-none" />
                            </div>
                            <button className="w-full py-3 mt-2 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-black transition-colors">
                                Find Loads
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100 gap-4">
                            <div className="flex bg-gray-100/80 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('trips')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'trips' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Active Trips
                                </button>
                                <button
                                    onClick={() => setActiveTab('loads')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'loads' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    New Leads
                                </button>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 transition-colors">
                                <MapPin size={16} /> Map View
                            </button>
                        </div>

                        <div className="p-6 flex-1">
                            {activeTab === 'trips' ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 text-gray-600">
                                                    <Truck size={24} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-sm font-semibold text-gray-900">MH-12-AX-{4821 + i}</h4>
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">In Transit</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                                        <Users size={14} />
                                                        <span>Arvind Singh</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 w-full sm:w-auto sm:min-w-[200px] max-w-sm">
                                                <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
                                                    <span>Mumbai</span>
                                                    <span className="text-gray-900">82%</span>
                                                    <span>Nagpur</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gray-900 w-[82%] rounded-full" />
                                                </div>
                                            </div>

                                            <div className="hidden sm:flex text-gray-400 group-hover:text-gray-900 transition-colors">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <VendorLeadsList title="Pending Assignments" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reusable Modal Structure Applied to Drivers */}
            <AnimatePresence>
                {showDriversModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={() => { setShowDriversModal(false); setStatsTrigger(p => p + 1); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Drivers Directory</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Manage your active fleet personnel</p>
                                </div>
                                <button
                                    onClick={() => { setShowDriversModal(false); setStatsTrigger(p => p + 1); }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                {vendorId ? (
                                    <DriversList vendorId={vendorId} onUpdate={() => setStatsTrigger(p => p + 1)} />
                                ) : (
                                    <div className="py-16 text-center">
                                        <p className="text-sm font-medium text-gray-900">Unable to load drivers</p>
                                        <p className="text-sm text-gray-500 mt-1">Vendor ID not found</p>
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
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={() => { setShowRoutesModal(false); setStatsTrigger(p => p + 1); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Fleet Routes</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Manage your vehicle transit paths</p>
                                </div>
                                <button
                                    onClick={() => { setShowRoutesModal(false); setStatsTrigger(p => p + 1); }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                {vendorId ? (
                                    <RoutesList vendorId={vendorId} onUpdate={() => setStatsTrigger(p => p + 1)} />
                                ) : (
                                    <div className="py-16 text-center">
                                        <p className="text-sm font-medium text-gray-900">Unable to load routes</p>
                                        <p className="text-sm text-gray-500 mt-1">Vendor ID not found</p>
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
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={() => { setShowVehiclesModal(false); setStatsTrigger(p => p + 1); }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Fleet Vehicles</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Manage your registered vehicles</p>
                                </div>
                                <button
                                    onClick={() => { setShowVehiclesModal(false); setStatsTrigger(p => p + 1); }}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                                {vendorId ? (
                                    <VehiclesList vendorId={vendorId} onUpdate={() => setStatsTrigger(p => p + 1)} />
                                ) : (
                                    <div className="py-16 text-center">
                                        <p className="text-sm font-medium text-gray-900">Unable to load vehicles</p>
                                        <p className="text-sm text-gray-500 mt-1">Vendor ID not found</p>
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