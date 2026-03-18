import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Clock, Check, X, MoreVertical, Plus, ArrowRight, ChevronRight, Globe, Loader2, LocateFixed } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const RoutesList = ({ vendorId, vehicleId = 1, title = "Route Management", refreshTrigger = 0 }) => {
    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');

    // Add Route Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState({ from: [], to: [] });

    // Cascading Picker State
    const [locations, setLocations] = useState({ states: [], cities: [], pincodes: [] });
    const [fetchingStatus, setFetchingStatus] = useState({ states: false, cities: false, pincodes: false });
    const [pickerState, setPickerState] = useState({
        active: null,
        step: 'states',
        selectedState: null,
        selectedCity: null,
        selectedPincode: null,
        searchQuery: ''
    });

    const pickerRef = useRef(null);

    // Initial Fetch for States
    useEffect(() => {
        const fetchStates = async () => {
            setFetchingStatus(prev => ({ ...prev, states: true }));
            try {
                const res = await fetch('https://dev.amankumarr.in/api/location/states');
                const data = await res.json();
                if (data.success) setLocations(prev => ({ ...prev, states: data.data }));
            } catch (err) {
                console.error("Failed to fetch states", err);
            } finally {
                setFetchingStatus(prev => ({ ...prev, states: false }));
            }
        };
        if (showAddModal) fetchStates();
    }, [showAddModal]);

    const handleLocationClick = async (type, item) => {
        if (type === 'state') {
            setPickerState(prev => ({ ...prev, selectedState: item, step: 'cities', selectedCity: null, selectedPincode: null, searchQuery: '' }));
            setFetchingStatus(prev => ({ ...prev, cities: true }));
            try {
                const res = await fetch(`https://dev.amankumarr.in/api/location/states/${item.id}/cities`);
                const data = await res.json();
                if (data.success) setLocations(prev => ({ ...prev, cities: data.data }));
            } catch (err) {
                console.error("Failed to fetch cities", err);
            } finally {
                setFetchingStatus(prev => ({ ...prev, cities: false }));
            }
        } else if (type === 'city') {
            setPickerState(prev => ({ ...prev, selectedCity: item, step: 'pincodes', selectedPincode: null, searchQuery: '' }));
            setFetchingStatus(prev => ({ ...prev, pincodes: true }));
            try {
                const res = await fetch(`https://dev.amankumarr.in/api/location/cities/${item.id}/pincodes`);
                const data = await res.json();
                if (data.success) setLocations(prev => ({ ...prev, pincodes: data.data }));
            } catch (err) {
                console.error("Failed to fetch pincodes", err);
            } finally {
                setFetchingStatus(prev => ({ ...prev, pincodes: false }));
            }
        } else if (type === 'pincode') {
            const displayValue = `${pickerState.selectedCity.cityName} - ${item.pincode}`;
            setAddForm(prev => {
                const current = prev[pickerState.active] || [];
                if (current.includes(displayValue)) {
                    return { ...prev, [pickerState.active]: current.filter(v => v !== displayValue) };
                }
                return { ...prev, [pickerState.active]: [...current, displayValue] };
            });
        }
    };

    const closePicker = () => {
        setPickerState({ active: null, step: 'states', selectedState: null, selectedCity: null, selectedPincode: null, searchQuery: '' });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                closePicker();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchRoutes = async () => {
        if (!vendorId) return;
        setIsLoading(true);
        setError('');
        try {
            let url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${vehicleId}/routes`;
            const params = new URLSearchParams();
            if (searchFrom) params.append('from', searchFrom);
            if (searchTo) params.append('to', searchTo);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const res = await fetchWithAuth(url, { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch routes');
            const data = await res.json();

            const routeList = data.data || data.routes || data;
            setRoutes(Array.isArray(routeList) ? routeList : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, [vendorId, vehicleId, refreshTrigger]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRoutes();
    };

    const handleAddRoute = async (e) => {
        e.preventDefault();
        if (!addForm.from.trim() || !addForm.to.trim()) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Please enter both cities', showConfirmButton: false, timer: 2000 });
            return;
        }
        setIsAdding(true);
        try {
            const fromStr = addForm.from.join(', ');
            const toStr = addForm.to.join(', ');
            const url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${vehicleId}/routes?from=${encodeURIComponent(fromStr)}&to=${encodeURIComponent(toStr)}`;

            const res = await fetchWithAuth(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Route added successfully', showConfirmButton: false, timer: 3000 });
                setShowAddModal(false);
                setAddForm({ from: [], to: [] });
                fetchRoutes();
            } else {
                let errorTitle = 'Failed to add route';
                try {
                    const data = await res.json();
                    errorTitle = data.message || data.error || `Server responded with ${res.status}`;
                } catch {
                    errorTitle = `Server error ${res.status}`;
                }
                throw new Error(errorTitle);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Route Creation Failed', text: err.message });
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Listing Header - Kept mostly intact but slightly refined to match new modal */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        <p className="text-slate-500 text-sm mt-1">Total {routes.length} Active Routes</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 flex-1">
                            <div className="relative flex-grow min-w-[120px]">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="From"
                                    value={searchFrom}
                                    onChange={(e) => setSearchFrom(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                />
                            </div>
                            <div className="hidden sm:block text-slate-300">
                                <ArrowRight size={14} />
                            </div>
                            <div className="relative flex-grow min-w-[120px]">
                                <Navigation className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="To"
                                    value={searchTo}
                                    onChange={(e) => setSearchTo(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                            <Plus size={16} />
                            Add Route
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                            <p className="text-slate-500 text-sm">Loading routes...</p>
                        </div>
                    ) : routes.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Navigation size={24} />
                            </div>
                            <p className="text-slate-900 font-medium text-sm">No routes found</p>
                            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or create a new route.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Origin & Destination</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Distance</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Est. Duration</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {routes.map((route, idx) => (
                                    <tr key={route.id || route._id || idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center">
                                                    <Navigation size={14} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                                        <span>{route.from || route.origin}</span>
                                                        <ArrowRight size={14} className="text-slate-400" />
                                                        <span>{route.to || route.destination}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">ID: {route.id || route._id || `RT-${100 + idx}`}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                <MapPin size={14} className="text-slate-400" />
                                                {route.distance || '---'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-slate-400" />
                                                {route.duration || '---'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${route.status === 'Inactive' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                                {route.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Refactored Minimal Add Route Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-2xl w-full max-w-4xl shadow-xl relative flex flex-col md:flex-row h-[85vh] md:h-[600px] overflow-hidden border border-slate-200"
                        >
                            {/* Form Side */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-900">Add New Route</h2>
                                        <p className="text-sm text-slate-500 mt-1">Configure origin and destination points.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddRoute} className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
                                    {/* Pickup Selection */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-slate-700">Origin Nodes</label>
                                            {addForm.from.length > 0 && (
                                                <span className="text-xs font-medium text-slate-500">{addForm.from.length} selected</span>
                                            )}
                                        </div>
                                        <div
                                            onClick={() => setPickerState({ active: 'from', step: 'states', searchQuery: '' })}
                                            className={`min-h-[52px] w-full p-2 bg-white border rounded-xl flex flex-wrap gap-2 items-center cursor-pointer transition-all
                                                ${pickerState.active === 'from' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {addForm.from.length === 0 ? (
                                                <span className="text-slate-400 text-sm px-2">Select origin points...</span>
                                            ) : (
                                                addForm.from.map((node, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5">
                                                        {node}
                                                        <X size={12}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAddForm(prev => ({ ...prev, from: prev.from.filter(n => n !== node) }));
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Connector */}
                                    <div className="flex justify-center my-3 relative z-10">
                                        <div className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 shadow-sm">
                                            <ArrowRight size={16} className="rotate-90 md:rotate-0" />
                                        </div>
                                    </div>

                                    {/* Destination Selection */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-slate-700">Destination Nodes</label>
                                            {addForm.to.length > 0 && (
                                                <span className="text-xs font-medium text-slate-500">{addForm.to.length} selected</span>
                                            )}
                                        </div>
                                        <div
                                            onClick={() => setPickerState({ active: 'to', step: 'states', searchQuery: '' })}
                                            className={`min-h-[52px] w-full p-2 bg-white border rounded-xl flex flex-wrap gap-2 items-center cursor-pointer transition-all
                                                ${pickerState.active === 'to' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {addForm.to.length === 0 ? (
                                                <span className="text-slate-400 text-sm px-2">Select destination points...</span>
                                            ) : (
                                                addForm.to.map((node, i) => (
                                                    <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5">
                                                        {node}
                                                        <X size={12}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAddForm(prev => ({ ...prev, to: prev.to.filter(n => n !== node) }));
                                                            }}
                                                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                                                        />
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isAdding || addForm.from.length === 0 || addForm.to.length === 0}
                                        className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-medium text-sm shadow-sm disabled:opacity-50 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isAdding && <Loader2 size={16} className="animate-spin" />}
                                        {isAdding ? 'Creating Route...' : 'Create Route'}
                                    </button>
                                </form>
                            </div>

                            {/* Cascading Picker Side */}
                            <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col relative" ref={pickerRef}>
                                <AnimatePresence mode="wait">
                                    {pickerState.active ? (
                                        <motion.div
                                            key="picker-active"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex-1 flex flex-col h-full"
                                        >
                                            {/* Picker Header */}
                                            <div className="p-5 bg-slate-50 border-b border-slate-200 space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-white border border-slate-200 text-slate-600 rounded-lg flex items-center justify-center shadow-sm">
                                                        {pickerState.step === 'states' && <Globe size={16} />}
                                                        {pickerState.step === 'cities' && <LocateFixed size={16} />}
                                                        {pickerState.step === 'pincodes' && <MapPin size={16} />}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-slate-900">
                                                            {pickerState.step === 'states' ? 'Select State' :
                                                                pickerState.step === 'cities' ? 'Select City' : 'Select Pincode'}
                                                        </h3>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {pickerState.step === 'cities' ? pickerState.selectedState?.stateName :
                                                                pickerState.step === 'pincodes' ? pickerState.selectedCity?.cityName : 'India'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder={`Search ${pickerState.step}...`}
                                                        value={pickerState.searchQuery}
                                                        onChange={(e) => setPickerState(prev => ({ ...prev, searchQuery: e.target.value }))}
                                                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            {/* List Content */}
                                            <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
                                                {fetchingStatus[pickerState.step] ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                                                        <Loader2 size={24} className="animate-spin" />
                                                        <span className="text-xs font-medium">Loading data...</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2 pb-20">
                                                        {pickerState.step === 'states' && locations.states
                                                            .filter(s => s.stateName.toLowerCase().includes(pickerState.searchQuery.toLowerCase()))
                                                            .map(state => (
                                                                <button
                                                                    key={state.id}
                                                                    onClick={() => handleLocationClick('state', state)}
                                                                    className="w-full p-3 flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-slate-400 hover:shadow-sm transition-all group"
                                                                >
                                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{state.stateName}</span>
                                                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                                                                </button>
                                                            ))}

                                                        {pickerState.step === 'cities' && locations.cities
                                                            .filter(c => c.cityName.toLowerCase().includes(pickerState.searchQuery.toLowerCase()))
                                                            .map(city => (
                                                                <button
                                                                    key={city.id}
                                                                    onClick={() => handleLocationClick('city', city)}
                                                                    className="w-full p-3 flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-slate-400 hover:shadow-sm transition-all group"
                                                                >
                                                                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{city.cityName}</span>
                                                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500" />
                                                                </button>
                                                            ))}

                                                        {pickerState.step === 'pincodes' && locations.pincodes
                                                            .filter(p => p.pincode.includes(pickerState.searchQuery))
                                                            .map(pin => {
                                                                const displayValue = `${pickerState.selectedCity.cityName} - ${pin.pincode}`;
                                                                const isSelected = addForm[pickerState.active]?.includes(displayValue);
                                                                return (
                                                                    <button
                                                                        key={pin.id}
                                                                        onClick={() => handleLocationClick('pincode', pin)}
                                                                        className={`w-full p-3 flex items-center justify-between rounded-lg transition-all border 
                                                                            ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 hover:border-slate-400'}`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <MapPin size={14} className={isSelected ? 'text-slate-300' : 'text-slate-400'} />
                                                                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>{pin.pincode}</span>
                                                                        </div>
                                                                        {isSelected && <Check size={16} className="text-white" />}
                                                                    </button>
                                                                );
                                                            })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Footer */}
                                            <div className="p-4 border-t border-slate-200 bg-slate-50/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-20 space-y-2">
                                                {addForm[pickerState.active]?.length > 0 && (
                                                    <button
                                                        onClick={closePicker}
                                                        className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                                                    >
                                                        Done ({addForm[pickerState.active].length} selected)
                                                    </button>
                                                )}
                                                {pickerState.step !== 'states' && (
                                                    <button
                                                        onClick={() => setPickerState(prev => ({
                                                            ...prev,
                                                            step: prev.step === 'pincodes' ? 'cities' : 'states'
                                                        }))}
                                                        className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        <ArrowRight size={14} className="rotate-180" />
                                                        Back
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <MapPin size={20} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-500">Select an input to <br /> browse locations</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RoutesList;