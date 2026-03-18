import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import { 
    LayoutDashboard, Briefcase, Truck, Users, Wallet, MapPin, Globe, 
    ArrowRight, Navigation, Search, RefreshCw, X, MapPinOff, ChevronDown, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import RoutesList from '../../../components/Dashboard/RoutesList';

const VendorRoutesPage = () => {
    const { user, loading } = useAuth();
    const [states, setStates] = useState([]);
    const [fetchingStates, setFetchingStates] = useState(true);
    const [stateError, setStateError] = useState(null);

    // City Selection States
    const [selectedState, setSelectedState] = useState(null);
    const [cities, setCities] = useState([]);
    const [fetchingCities, setFetchingCities] = useState(false);
    const [cityError, setCityError] = useState(null);
    const [showCityModal, setShowCityModal] = useState(false);

    // Pincode States
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [pincodes, setPincodes] = useState([]);
    const [fetchingPincodes, setFetchingPincodes] = useState(false);
    const [pincodeError, setPincodeError] = useState(null);

    // State Pincode States
    const [statePincodes, setStatePincodes] = useState([]);
    const [fetchingStatePincodes, setFetchingStatePincodes] = useState(false);
    const [statePincodeError, setStatePincodeError] = useState(null);
    const [activeTab, setActiveTab] = useState('cities'); // 'cities' or 'pincodes'
    const [pincodeSearch, setPincodeSearch] = useState('');

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/vendor' },
        { icon: Briefcase, label: 'Available Loads', path: '/dashboard/vendor/loads' },
        { icon: Truck, label: 'Fleet Status', path: '/dashboard/vendor/fleet' },
        { icon: Users, label: 'Driver Mgmt', path: '/dashboard/vendor/drivers' },
        { icon: MapPin, label: 'Routes', path: '/dashboard/vendor/routes' },
        { icon: Wallet, label: 'Earnings', path: '/dashboard/vendor/earnings' },
    ];

    const fetchStates = async () => {
        setFetchingStates(true);
        setStateError(null);
        try {
            const response = await fetch('https://dev.amankumarr.in/api/location/states');
            if (!response.ok) throw new Error('Failed to fetch states');
            const result = await response.json();
            if (result.success) {
                setStates(result.data);
            } else {
                setStateError(result.message || 'Unknown error');
            }
        } catch (err) {
            setStateError(err.message);
        } finally {
            setFetchingStates(false);
        }
    };

    const handleStateClick = async (state) => {
        setSelectedState(state);
        setShowCityModal(true);
        setFetchingCities(true);
        setCityError(null);
        setCities([]);
        setSelectedCityId(null);
        setPincodes([]);
        setStatePincodes([]);
        setActiveTab('cities');
        setPincodeSearch('');

        // Fetch Cities
        try {
            const response = await fetch(`https://dev.amankumarr.in/api/location/states/${state.id}/cities`);
            if (!response.ok) throw new Error('Failed to fetch cities');
            const result = await response.json();
            if (result.success) {
                setCities(result.data);
            } else {
                setCityError(result.message || 'No cities found');
            }
        } catch (err) {
            setCityError(err.message);
        } finally {
            setFetchingCities(false);
        }

        // Fetch State Pincodes
        setFetchingStatePincodes(true);
        try {
            const response = await fetch(`https://dev.amankumarr.in/api/location/states/${state.id}/pincodes`);
            if (!response.ok) throw new Error('Failed to fetch state pincodes');
            const result = await response.json();
            if (result.success) {
                setStatePincodes(result.data);
            }
        } catch (err) {
            setStatePincodeError(err.message);
        } finally {
            setFetchingStatePincodes(false);
        }
    };

    const handleCityClick = async (cityId) => {
        if (selectedCityId === cityId) {
            setSelectedCityId(null);
            setPincodes([]);
            return;
        }

        setSelectedCityId(cityId);
        setFetchingPincodes(true);
        setPincodes([]);
        setPincodeError(null);

        try {
            const response = await fetch(`https://dev.amankumarr.in/api/location/cities/${cityId}/pincodes`);
            if (!response.ok) throw new Error('Failed to fetch pincodes');
            const result = await response.json();
            if (result.success) {
                setPincodes(result.data);
            } else {
                setPincodeError('No pincodes found for this city');
            }
        } catch (err) {
            setPincodeError(err.message);
        } finally {
            setFetchingPincodes(false);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

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

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 border-l-8 border-orange-600 pl-6 uppercase tracking-tighter italic">Route Network</h1>
                        <p className="text-slate-400 text-xs font-bold mt-2 ml-8 uppercase tracking-[0.2em] italic">Manage transit paths and explore operational regions</p>
                    </div>
                    <button 
                        onClick={fetchStates}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={14} className={fetchingStates ? "animate-spin" : ""} />
                        Refresh Locations
                    </button>
                </div>

                {/* States Grid */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 transition-transform duration-700" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                                <Globe size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Operational States</h2>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-orange-600">Click a state to view available cities</p>
                            </div>
                        </div>

                        {fetchingStates ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-50">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : stateError ? (
                            <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-red-600 font-bold text-sm uppercase">{stateError}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {states.map((state) => (
                                    <motion.div 
                                        key={state.id}
                                        whileHover={{ y: -2 }}
                                        onClick={() => handleStateClick(state)}
                                        className="group p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-bold text-slate-700 truncate group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                                                {state.stateName}
                                            </span>
                                            <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-600 transition-all group-hover:translate-x-1" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Route Management Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-1.5 h-8 bg-slate-900 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-slate-900">Active Fleet Routes</h2>
                    </div>
                    
                    {vendorId ? (
                        <RoutesList vendorId={vendorId} title="My Configured Routes" />
                    ) : (
                        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Navigation size={32} />
                            </div>
                            <p className="text-red-500 font-bold uppercase text-xs italic">Unable to load routes</p>
                            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-2">Vendor ID not found in profile</p>
                        </div>
                    )}
                </div>
            </div>

            {/* City Selection Modal */}
            <AnimatePresence>
                {showCityModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                        onClick={() => setShowCityModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white w-full max-w-5xl max-h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                            
                            <div className="p-8 md:p-10 border-b border-slate-100 flex justify-between items-center relative z-10 bg-white/90 backdrop-blur-md">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                                        <MapPin className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                                            {selectedState?.stateName} <span className="text-orange-600">Region HUB</span>
                                        </h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">State-wide logistics directory & network map</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCityModal(false)}
                                    className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all group"
                                >
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>

                            {/* Tab Switcher & Global Search */}
                            <div className="px-8 py-6 bg-white flex flex-col md:flex-row items-center justify-between border-b border-slate-50 gap-6">
                                <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl w-full md:w-auto">
                                    <button 
                                        onClick={() => setActiveTab('cities')}
                                        className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                            ${activeTab === 'cities' ? 'bg-white text-orange-600 shadow-xl shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        City Browse ({cities.length})
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('pincodes')}
                                        className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                            ${activeTab === 'pincodes' ? 'bg-white text-orange-600 shadow-xl shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        State Pincodes ({statePincodes.length})
                                    </button>
                                </div>

                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text"
                                        placeholder={`Search ${activeTab === 'cities' ? 'cities' : 'pincodes'}...`}
                                        value={pincodeSearch}
                                        onChange={(e) => setPincodeSearch(e.target.value)}
                                        className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-slate-50/50 custom-scrollbar-orange relative z-10">
                                {activeTab === 'cities' ? (
                                    fetchingCities ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="h-20 bg-white rounded-3xl border border-slate-100 animate-pulse"></div>
                                            ))}
                                        </div>
                                    ) : cityError ? (
                                        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed max-w-md mx-auto">
                                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <MapPinOff size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 uppercase italic">No Cities Available</h3>
                                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 px-8">{cityError}</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                            {cities
                                                .filter(c => c.cityName.toLowerCase().includes(pincodeSearch.toLowerCase()))
                                                .map((city) => (
                                                <div key={city.id} className="relative group/city">
                                                    <motion.div
                                                        layout
                                                        onClick={() => handleCityClick(city.id)}
                                                        className={`p-6 bg-white rounded-3xl border transition-all cursor-pointer flex items-center justify-between relative z-10
                                                            ${selectedCityId === city.id 
                                                                ? 'border-orange-500 ring-4 ring-orange-500/5 shadow-xl transition-all duration-200' 
                                                                : 'border-slate-100 hover:border-orange-300 hover:shadow-md'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                                                                ${selectedCityId === city.id ? 'bg-orange-600' : 'bg-slate-200 group-hover/city:bg-orange-300'}`}>
                                                            </div>
                                                            <span className={`font-black uppercase tracking-tight transition-colors duration-200 text-sm
                                                                ${selectedCityId === city.id ? 'text-orange-600' : 'text-slate-800'}`}>
                                                                {city.cityName}
                                                            </span>
                                                        </div>
                                                        <div className={`transition-transform duration-300 ${selectedCityId === city.id ? 'rotate-180 text-orange-600' : 'text-slate-300 group-hover/city:text-orange-300'}`}>
                                                            <ChevronDown size={20} />
                                                        </div>
                                                    </motion.div>

                                                    <AnimatePresence>
                                                        {selectedCityId === city.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="mt-2 bg-white rounded-[2rem] border border-orange-100 shadow-xl overflow-hidden relative z-0 origin-top"
                                                            >
                                                                <div className="p-3 bg-orange-50/50 border-b border-orange-100 flex items-center justify-center gap-2">
                                                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest italic">Serviceable Pincodes</p>
                                                                </div>
                                                                <div className="max-h-56 overflow-y-auto p-4 bg-white custom-scrollbar-orange">
                                                                    {fetchingPincodes ? (
                                                                        <div className="flex flex-col items-center justify-center py-6 gap-3">
                                                                            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                                                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest italic">Searching...</span>
                                                                        </div>
                                                                    ) : pincodeError ? (
                                                                        <div className="py-6 text-center px-4">
                                                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">{pincodeError}</p>
                                                                        </div>
                                                                    ) : pincodes.length === 0 ? (
                                                                        <div className="py-6 text-center px-4">
                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No pincodes archived</p>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="grid grid-cols-2 gap-2">
                                                                            {pincodes.map((p) => (
                                                                                <div 
                                                                                    key={p.id}
                                                                                    className="p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-orange-500 hover:bg-orange-600 hover:text-white transition-all cursor-default text-center group/pin relative overflow-hidden"
                                                                                >
                                                                                    <span className="text-xs font-black tracking-widest block italic relative z-10">{p.pincode}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="p-2 bg-slate-50 border-t border-slate-100 flex justify-center">
                                                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">{pincodes.length} Pincodes</p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    /* State Pincodes Global View */
                                    fetchingStatePincodes ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-black text-orange-600 uppercase tracking-[0.2em] italic">Compiling State-wide Directory...</p>
                                        </div>
                                    ) : statePincodes.length === 0 ? (
                                        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed max-w-md mx-auto">
                                            <p className="text-slate-400 font-black uppercase tracking-widest italic text-sm">No state pincodes synchronized</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                                            {statePincodes
                                                .filter(p => p.pincode.includes(pincodeSearch))
                                                .map((p) => (
                                                <div 
                                                    key={p.id}
                                                    className="p-4 bg-white rounded-2xl border border-slate-100 ring-4 ring-transparent hover:ring-orange-500/5 hover:border-orange-400 transition-all cursor-default group/global flex flex-col items-center"
                                                >
                                                    <span className="text-xs font-black text-slate-900 block tracking-widest italic group-hover:text-orange-600 transition-colors">{p.pincode}</span>
                                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-tighter mt-1 truncate w-full text-center group-hover:text-slate-400">{p.cityName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="p-8 bg-white border-t border-slate-100 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">
                                        Active Nodes: {activeTab === 'cities' ? cities.length : statePincodes.length} Units
                                    </p>
                                </div>
                                <div className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Dot2Dotz Location Engine v2.0</div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default VendorRoutesPage;
