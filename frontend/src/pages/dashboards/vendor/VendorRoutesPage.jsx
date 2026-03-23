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
                    <p className="text-sm text-gray-500 font-medium">Loading Routes...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebarItems={sidebarItems} roleName="Vendor Owner">
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Route Network</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage transit paths and explore operational regions</p>
                    </div>
                    <button
                        onClick={fetchStates}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <RefreshCw size={16} className={fetchingStates ? "animate-spin text-blue-600" : "text-gray-500"} />
                        Refresh Locations
                    </button>
                </div>

                {/* States Grid */}


                {/* Route Management Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Active Fleet Routes</h2>

                    {vendorId ? (
                        <RoutesList vendorId={vendorId} title="My Configured Routes" />
                    ) : (
                        <div className="py-16 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 border border-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Navigation size={24} />
                            </div>
                            <p className="text-base font-medium text-gray-900">Unable to load routes</p>
                            <p className="text-sm text-gray-500 mt-1">Vendor ID not found in profile</p>
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
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
                        onClick={() => setShowCityModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-5xl max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedState?.stateName} Region
                                        </h2>
                                        <p className="text-sm text-gray-500">State-wide logistics directory & network map</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCityModal(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Tab Switcher & Global Search */}
                            <div className="px-6 py-4 bg-white flex flex-col md:flex-row items-center justify-between border-b border-gray-100 gap-4">
                                <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
                                    <button
                                        onClick={() => setActiveTab('cities')}
                                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'cities' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Browse Cities ({cities.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('pincodes')}
                                        className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'pincodes' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        State Pincodes ({statePincodes.length})
                                    </button>
                                </div>

                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder={`Search ${activeTab === 'cities' ? 'cities' : 'pincodes'}...`}
                                        value={pincodeSearch}
                                        onChange={(e) => setPincodeSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors outline-none"
                                    />
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50/50">
                                {activeTab === 'cities' ? (
                                    fetchingCities ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[...Array(9)].map((_, i) => (
                                                <div key={i} className="h-16 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
                                            ))}
                                        </div>
                                    ) : cityError ? (
                                        <div className="py-16 text-center bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
                                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MapPinOff size={24} />
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900">No Cities Available</h3>
                                            <p className="text-gray-500 text-sm mt-1 px-6">{cityError}</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {cities
                                                .filter(c => c.cityName.toLowerCase().includes(pincodeSearch.toLowerCase()))
                                                .map((city) => (
                                                    <div key={city.id} className="relative">
                                                        <motion.div
                                                            layout
                                                            onClick={() => handleCityClick(city.id)}
                                                            className={`p-4 bg-white rounded-xl border transition-all cursor-pointer flex items-center justify-between
                                                                ${selectedCityId === city.id
                                                                    ? 'border-gray-900 shadow-sm ring-1 ring-gray-900/10'
                                                                    : 'border-gray-200 hover:border-gray-300'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-4 h-4 rounded-full border flex flex-shrink-0 items-center justify-center transition-colors
                                                                    ${selectedCityId === city.id ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
                                                                    {selectedCityId === city.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                                </div>
                                                                <span className="font-medium text-sm text-gray-900">
                                                                    {city.cityName}
                                                                </span>
                                                            </div>
                                                            <div className={`transition-transform duration-200 text-gray-400 ${selectedCityId === city.id ? 'rotate-180 text-gray-900' : ''}`}>
                                                                <ChevronDown size={18} />
                                                            </div>
                                                        </motion.div>

                                                        <AnimatePresence>
                                                            {selectedCityId === city.id && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="mt-2 p-4 bg-gray-100/50 border border-gray-200 rounded-xl">
                                                                        {fetchingPincodes ? (
                                                                            <div className="flex justify-center py-4">
                                                                                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                                                            </div>
                                                                        ) : pincodeError ? (
                                                                            <p className="text-sm text-center text-gray-500 py-2">{pincodeError}</p>
                                                                        ) : pincodes.length === 0 ? (
                                                                            <p className="text-sm text-center text-gray-500 py-2">No pincodes archived</p>
                                                                        ) : (
                                                                            <div className="flex flex-wrap gap-2">
                                                                                {pincodes.map((p) => (
                                                                                    <div
                                                                                        key={p.id}
                                                                                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 shadow-sm"
                                                                                    >
                                                                                        {p.pincode}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
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
                                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                                            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-sm font-medium text-gray-500">Compiling Directory...</p>
                                        </div>
                                    ) : statePincodes.length === 0 ? (
                                        <div className="py-16 text-center bg-white rounded-xl border border-gray-200 max-w-sm mx-auto">
                                            <p className="text-gray-500 font-medium text-sm">No state pincodes synchronized</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                            {statePincodes
                                                .filter(p => p.pincode.includes(pincodeSearch))
                                                .map((p) => (
                                                    <div
                                                        key={p.id}
                                                        className="p-3 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all flex flex-col items-center justify-center text-center gap-1 cursor-default"
                                                    >
                                                        <span className="text-sm font-semibold text-gray-900">{p.pincode}</span>
                                                        <span className="text-xs text-gray-500 truncate w-full">{p.cityName}</span>
                                                    </div>
                                                ))}
                                        </div>
                                    )
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <p className="text-sm font-medium text-gray-500">
                                        {activeTab === 'cities' ? `${cities.length} Cities` : `${statePincodes.length} Pincodes`} Available
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                )}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Globe size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Operational States</h2>
                            <p className="text-sm text-gray-500">Click a state to view available cities and pincodes.</p>
                        </div>
                    </div>

                    {fetchingStates ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-70">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : stateError ? (
                        <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-xl">
                            <p className="text-sm font-medium text-gray-900">{stateError}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {states.map((state) => (
                                <div
                                    key={state.id}
                                    onClick={() => handleStateClick(state)}
                                    className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
                                >
                                    <span className="text-sm font-medium text-gray-900 truncate">
                                        {state.stateName}
                                    </span>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default VendorRoutesPage;