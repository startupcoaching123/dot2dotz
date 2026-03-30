import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Clock, Check, X, MoreVertical, Plus, ArrowRight, ChevronRight, Globe, Loader2, LocateFixed, Edit2, Trash2, Eye, Calendar, Users, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const CityListItem = ({ city, isZoneMode, selectedPincodeIds, onClick, onToggle }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    return (
        <div className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg hover:border-slate-400 hover:shadow-sm transition-all group overflow-hidden pr-2">
            <button
                type="button"
                onClick={() => onClick(city)}
                className="flex-1 p-3 flex items-center justify-between text-left"
            >
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{city.cityName}</span>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 mr-2" />
            </button>
            {isZoneMode && (
                <button
                    type="button"
                    disabled={isLoading}
                    onClick={async (e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        await onToggle(city);
                        setIsLoading(false);
                    }}
                    className="p-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 min-w-[85px] flex justify-center"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'TOGGLE ALL'}
                </button>
            )}
        </div>
    );
};

const RoutesList = ({ vendorId, vehicleId = 1, title = "Route Management", refreshTrigger = 0, onUpdate }) => {
    const [routes, setRoutes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');

    // View Modal State
    const [viewingRoute, setViewingRoute] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [zoneSearch, setZoneSearch] = useState('');

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

    // New Zone & Fleet States
    const [fleets, setFleets] = useState([]);
    const [selectedFleetId, setSelectedFleetId] = useState('');
    const [routeType, setRouteType] = useState('CORRIDOR'); // 'CORRIDOR' or 'ZONE'
    const [routeName, setRouteName] = useState('');
    const [selectedZoneState, setSelectedZoneState] = useState(null);
    const [selectedPincodeIds, setSelectedPincodeIds] = useState([]);
    const [isFetchingZoneData, setIsFetchingZoneData] = useState(false);

    // Corridor specific state
    const [corridorStops, setCorridorStops] = useState([
        { id: Date.now(), pincode: null, pincodeId: null, pickupPoint: true, dropPoint: false },
        { id: Date.now() + 1, pincode: null, pincodeId: null, pickupPoint: false, dropPoint: true }
    ]);
    const [activeStopIndex, setActiveStopIndex] = useState(null);
    const [editingRouteId, setEditingRouteId] = useState(null);

    const pickerRef = useRef(null);

    // Initial Fetch for States & Fleets
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

        const fetchFleets = async () => {
            if (!vendorId) return;
            try {
                const res = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet`);
                if (res.ok) {
                    const data = await res.json();
                    setFleets(data.data || data.vehicles || data.fleet || []);
                }
            } catch (err) {
                console.error("Failed to fetch fleets", err);
            }
        };

        if (showAddModal) {
            fetchStates();
            fetchFleets();
        }
    }, [showAddModal, vendorId]);

    const handleLocationClick = async (type, item) => {
        if (type === 'state') {
            setPickerState(prev => ({ ...prev, selectedState: item, step: 'cities', selectedCity: null, selectedPincode: null, searchQuery: '' }));
            setFetchingStatus(prev => ({ ...prev, cities: true }));
            
            // If ZONE mode, auto select ALL pincodes in state
            if (routeType === 'ZONE') {
                setSelectedZoneState(item);
                setIsFetchingZoneData(true);
                try {
                    const res = await fetch(`https://dev.amankumarr.in/api/location/states/${item.id}/pincodes`);
                    const data = await res.json();
                    if (data.success) {
                        const allPincodeIds = data.data.map(p => p.id);
                        setSelectedPincodeIds(allPincodeIds);
                    }
                } catch (err) {
                    console.error("Failed to fetch zone pincodes", err);
                } finally {
                    setIsFetchingZoneData(false);
                }
            }

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
            if (routeType === 'ZONE') {
                setSelectedPincodeIds(prev => 
                    prev.includes(item.id) 
                        ? prev.filter(id => id !== item.id) 
                        : [...prev, item.id]
                );
            } else {
                // CORRIDOR Mode: assign to specific stop
                const displayValue = `${pickerState.selectedCity.cityName} - ${item.pincode}`;
                setCorridorStops(prev => {
                    const updated = [...prev];
                    if (activeStopIndex !== null && updated[activeStopIndex]) {
                        updated[activeStopIndex] = {
                            ...updated[activeStopIndex],
                            pincode: displayValue,
                            pincodeId: item.id
                        };
                    }
                    return updated;
                });
                closePicker();
            }
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

    const getVehicleId = (v) => v?.vendorVehiclesId || v?.id || v?._id || v?.vehicle_id || v?.vehicleId;

    const fetchRoutes = async (currentFleets = fleets) => {
        if (!vendorId) return;
        setIsLoading(true);
        setError('');
        try {
            if (selectedFleetId) {
                let url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${selectedFleetId}/routes`;
                const params = new URLSearchParams();
                if (searchFrom) params.append('from', searchFrom);
                if (searchTo) params.append('to', searchTo);
                if (params.toString()) url += `?${params.toString()}`;

                const res = await fetchWithAuth(url, { method: 'GET' });
                if (!res.ok) throw new Error('Failed to fetch routes');
                const data = await res.json();
                const routeList = data.data || data.routes || data;
                setRoutes(Array.isArray(routeList) ? routeList : []);
                setIsLoading(false);
                return;
            }

            let activeFleets = currentFleets;
            if (!activeFleets || activeFleets.length === 0) {
                try {
                    const resV = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet`);
                    if (resV.ok) {
                        const dataV = await resV.json();
                        activeFleets = dataV.data || dataV.vehicles || dataV.fleet || [];
                        setFleets(activeFleets);
                    }
                } catch(e) {}
            }

            if (!activeFleets || activeFleets.length === 0) {
                setRoutes([]);
                setIsLoading(false);
                return;
            }

            let allRoutes = [];
            for (const fleet of activeFleets) {
                const fId = getVehicleId(fleet);
                if (!fId) continue;

                let url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${fId}/routes`;
                const params = new URLSearchParams();
                if (searchFrom) params.append('from', searchFrom);
                if (searchTo) params.append('to', searchTo);
                if (params.toString()) url += `?${params.toString()}`;

                try {
                    const res = await fetchWithAuth(url, { method: 'GET' });
                    if (res.ok) {
                        const data = await res.json();
                        const rList = data.data || data.routes || data;
                        if (Array.isArray(rList)) {
                            allRoutes = [...allRoutes, ...rList.map(r => ({...r, fleetRef: fleet.vehicleNumber || fleet.vehicle_number || fleet.id}))];
                        }
                    }
                } catch(e) {}
            }
            setRoutes(allRoutes);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, [vendorId, selectedFleetId, refreshTrigger]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRoutes();
    };

    const handleAddRoute = async (e) => {
        e.preventDefault();
        
        if (!selectedFleetId) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Please select a fleet first', showConfirmButton: false, timer: 2000 });
            return;
        }

        let body = {};
        const fleetIdNum = Number(selectedFleetId);
        
        if (routeType === 'ZONE') {
            if (!routeName || !selectedZoneState || selectedPincodeIds.length === 0) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Please complete zone details', showConfirmButton: false, timer: 2000 });
                return;
            }
            body = {
                fleetId: fleetIdNum,
                routeType: "ZONE",
                routeName: routeName,
                stateId: selectedZoneState.id,
                selectedPincodeIds: selectedPincodeIds
            };
        } else {
            const validStops = corridorStops.filter(s => s.pincodeId);
            if (validStops.length < 2) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'At least 2 valid stops required', showConfirmButton: false, timer: 2000 });
                return;
            }
            
            body = {
                fleetId: fleetIdNum,
                routeType: "CORRIDOR",
                routeName: routeName || `${validStops[0].pincode} to ${validStops[validStops.length-1].pincode}`,
                stops: validStops.map((s, idx) => ({
                    stopOrder: idx + 1,
                    pincodeId: s.pincodeId,
                    pickupPoint: s.pickupPoint,
                    dropPoint: s.dropPoint
                }))
            };
        }

        setIsAdding(true);
        try {
            const isEditing = !!editingRouteId;
            let url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${selectedFleetId}/routes`;
            if (isEditing) {
                url += `/${editingRouteId}`;
            }

            const res = await fetchWithAuth(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `Route ${isEditing ? 'updated' : 'added'} successfully`, showConfirmButton: false, timer: 3000 });
                setShowAddModal(false);
                setAddForm({ from: [], to: [] });
                setRouteName('');
                setSelectedZoneState(null);
                setSelectedPincodeIds([]);
                setEditingRouteId(null);
                setCorridorStops([{ id: Date.now(), pincode: null, pincodeId: null, pickupPoint: true, dropPoint: false }, { id: Date.now()+1, pincode: null, pincodeId: null, pickupPoint: false, dropPoint: true }]);
                fetchRoutes();
                if (onUpdate) onUpdate();
            } else {
                let errorTitle = `Failed to ${isEditing ? 'update' : 'add'} route`;
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

    const handleEditRoute = (route) => {
        setShowViewModal(false); // Close view modal if open
        setEditingRouteId(route.routeId || route.id || route._id);
        
        if (route.fleetId || route.vehicleId || route.vendorVehicleId) {
            setSelectedFleetId((route.fleetId || route.vehicleId || route.vendorVehicleId).toString());
        }

        setRouteType(route.routeType || 'CORRIDOR');
        setRouteName(route.routeName || '');
        
        if (route.routeType === 'ZONE') {
            setSelectedPincodeIds(route.selectedPincodeIds || []);
            setSelectedZoneState(null); 
        } else {
            if (route.stops && route.stops.length > 0) {
                setCorridorStops(route.stops.map((s, idx) => ({
                    id: Date.now() + idx,
                    pincodeId: s.pincodeId || s.pincode,
                    pincode: `Stop ${idx + 1}`,
                    pickupPoint: s.pickupPoint ?? true,
                    dropPoint: s.dropPoint ?? true
                })));
            } else {
                setCorridorStops([{ id: Date.now(), pincode: null, pincodeId: null, pickupPoint: true, dropPoint: false }, { id: Date.now()+1, pincode: null, pincodeId: null, pickupPoint: false, dropPoint: true }]);
            }
        }
        setShowAddModal(true);
    };

    const handleDeleteRoute = async (route) => {
        const routeId = route.routeId || route.id || route._id;
        const result = await Swal.fire({
            title: 'Delete Route?',
            text: `Are you sure you want to delete ${route.routeName || 'this route'}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/routes/${routeId}`;
                const res = await fetchWithAuth(url, { method: 'DELETE' });
                if (res.ok) {
                    Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Route deleted successfully', showConfirmButton: false, timer: 3000 });
                    setShowViewModal(false);
                    fetchRoutes();
                } else {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.message || data.error || 'Failed to delete route');
                }
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Delete Failed', text: err.message });
            }
        }
    };

    // Sub-component for Route Row
    const RouteRow = ({ route, idx }) => {
        const isZone = route.routeType === 'ZONE';

        return (
            <tr 
                onClick={() => {
                    setViewingRoute(route);
                    setShowViewModal(true);
                }}
                className="hover:bg-slate-50/80 transition-all cursor-pointer group"
            >
                <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm
                            ${isZone ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                            {isZone ? <Globe size={18} /> : <Navigation size={18} />}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900 uppercase italic tracking-tight">{route.routeName || 'Unnamed Route'}</div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ref: {route.routeId || route.id || route._id || `RT-${100 + idx}`}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        ${isZone ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        {route.routeType}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <MapPin size={12} className="text-slate-400" />
                            {isZone ? `${route.selectedPincodeIds?.length || 0} Pincodes` : `${route.stops?.length || 0} Stops`}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${route.status === 'Inactive' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {route.status || 'Operational'}
                    </span>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditRoute(route);
                            }}
                            className="p-2 bg-slate-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors group-hover:bg-white border border-transparent group-hover:border-slate-100"
                            title="Edit Route"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoute(route);
                            }}
                            className="p-2 bg-slate-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors group-hover:bg-white border border-transparent group-hover:border-slate-100"
                            title="Delete Route"
                        >
                            <Trash2 size={14} />
                        </button>
                        <button 
                            className="p-2 rounded-lg transition-colors bg-slate-50 text-slate-400 hover:bg-slate-100 group-hover:bg-slate-900 group-hover:text-white border border-transparent"
                            title="View Details"
                        >
                            <Eye size={14} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-6 relative">
            {/* Main Listing Header */}
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
                            onClick={() => {
                                setEditingRouteId(null);
                                setRouteName('');
                                setRouteType('CORRIDOR');
                                setCorridorStops([{ id: Date.now(), pincode: null, pincodeId: null, pickupPoint: true, dropPoint: false }, { id: Date.now()+1, pincode: null, pincodeId: null, pickupPoint: false, dropPoint: true }]);
                                setSelectedPincodeIds([]);
                                setShowAddModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
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
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architecture</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coverage</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {routes.map((route, idx) => (
                                    <RouteRow key={route.id || route._id || idx} route={route} idx={idx} />
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            {/* View Details Modal */}
<AnimatePresence>
    {showViewModal && viewingRoute && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setShowViewModal(false)}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border
                            ${viewingRoute.routeType === 'ZONE' ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                            {viewingRoute.routeType === 'ZONE' ? <Globe size={24} /> : <Navigation size={24} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                                    {viewingRoute.routeName || 'Unnamed Route'}
                                </h2>
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${viewingRoute.status === 'Inactive' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                                    {viewingRoute.status || 'Operational'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>Ref: {viewingRoute.routeId || viewingRoute.id || viewingRoute._id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className={viewingRoute.routeType === 'ZONE' ? 'text-orange-500' : 'text-blue-500'}>{viewingRoute.routeType}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowViewModal(false)}
                        className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                    {viewingRoute.routeType === 'ZONE' ? (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Coverage Area</h4>
                                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black tracking-widest uppercase">
                                        {(viewingRoute.pincodeDetails || viewingRoute.zonePincodes || viewingRoute.selectedPincodeIds || []).length} Active
                                    </span>
                                </div>
                                
                                {/* Local Search for Zone Pincodes */}
                                <div className="relative w-full sm:w-48">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input 
                                        type="text"
                                        placeholder="Find pincode..."
                                        value={zoneSearch}
                                        onChange={(e) => setZoneSearch(e.target.value)}
                                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {(viewingRoute.pincodeDetails || viewingRoute.zonePincodes || viewingRoute.selectedPincodeIds || [])
                                    .filter(item => {
                                        if (!zoneSearch) return true;
                                        const searchStr = typeof item === 'object' ? `${item.pincode} ${item.area} ${item.city}` : String(item);
                                        return searchStr.toLowerCase().includes(zoneSearch.toLowerCase());
                                    })
                                    .map((item, i) => {
                                        // Handle both object and primitive ID formats defensively
                                        const isObj = typeof item === 'object' && item !== null;
                                        const pincodeNumber = isObj ? (item.pincode || item.id) : item;
                                        const areaName = isObj ? (item.area || item.areaName || item.city || 'Local Delivery Area') : 'Mapped Service Area';
                                        const cityName = isObj ? (item.city || item.cityName || '') : '';

                                        return (
                                            <div key={i} className="group relative flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-orange-300 hover:shadow-md rounded-xl transition-all cursor-default overflow-hidden">
                                                {/* Left Accent Bar on Hover */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                
                                                <div className="flex items-center gap-3 pl-1">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 flex items-center justify-center transition-colors">
                                                        <MapPin size={14} />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-black text-slate-800 tracking-wide block">{pincodeNumber}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">{areaName}</span>
                                                    </div>
                                                </div>
                                                
                                                {cityName && (
                                                    <div className="text-[9px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md border border-slate-100 whitespace-nowrap">
                                                        {cityName}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                })}
                            </div>
                            
                            {/* Empty State for Search */}
                            {zoneSearch && (viewingRoute.pincodeDetails || viewingRoute.zonePincodes || viewingRoute.selectedPincodeIds || []).filter(item => {
                                const searchStr = typeof item === 'object' ? `${item.pincode} ${item.area} ${item.city}` : String(item);
                                return searchStr.toLowerCase().includes(zoneSearch.toLowerCase());
                            }).length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm font-medium">
                                    No pincodes match "{zoneSearch}"
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Corridor Itinerary</h4>
                            
                            <div className="relative pl-4 space-y-8 before:absolute before:inset-y-0 before:left-[23px] before:w-0.5 before:bg-slate-100">
                                {viewingRoute.stops?.sort((a,b) => a.stopOrder - b.stopOrder).map((stop, i) => {
                                    const isFirst = i === 0;
                                    const isLast = i === viewingRoute.stops.length - 1;
                                    
                                    return (
                                        <div key={i} className="relative flex items-start gap-6">
                                            {/* Node */}
                                            <div className={`relative z-10 flex-shrink-0 w-4 h-4 rounded-full border-4 bg-white shadow-sm mt-1
                                                ${isFirst ? 'border-green-500' : isLast ? 'border-orange-500' : 'border-blue-500'}`} 
                                            />
                                            
                                            {/* Content */}
                                            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-default">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stop {stop.stopOrder}</span>
                                                    <div className="flex gap-2">
                                                        {stop.pickupPoint && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider">Pickup</span>}
                                                        {stop.dropPoint && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-bold uppercase tracking-wider">Drop</span>}
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900">
                                                    PIN: {stop.pincodeId || stop.pincode}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={() => handleDeleteRoute(viewingRoute)}
                        className="px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                    <button
                        onClick={() => handleEditRoute(viewingRoute)}
                        className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2"
                    >
                        <Edit2 size={16} /> Edit Route
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )}
</AnimatePresence>

            {/* Refactored Minimal Add Route Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col md:flex-row h-[85vh] md:h-[650px] overflow-hidden border border-slate-200"
                        >
                            {/* Form Side */}
                            <div className="flex-1 p-6 md:p-8 flex flex-col relative z-10 bg-white">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">{editingRouteId ? 'Edit Route' : 'Add New Route'}</h2>
                                        <p className="text-sm text-slate-500 mt-1">{editingRouteId ? 'Update operational path for the route.' : 'Select fleet and configure operational path.'}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setEditingRouteId(null);
                                        }}
                                        className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddRoute} className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar pb-4">
                                    {/* Fleet Selection */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assign to Fleet</label>
                                        <select 
                                            value={selectedFleetId}
                                            onChange={(e) => setSelectedFleetId(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-shadow text-sm"
                                        >
                                            <option value="">Choose a Fleet...</option>
                                            {fleets.map((f, idx) => {
                                                const fId = getVehicleId(f) || (101 + idx);
                                                return (
                                                    <option key={fId} value={fId}>
                                                        ID: {fId} - {f.vehicle || f.vehicleNumber || f.vehicle_number || 'Fleet Item'}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    {/* Route Mode Switcher */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Route Architecture</label>
                                        <div className="flex gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-100">
                                            {['CORRIDOR', 'ZONE'].map(mode => (
                                                <button
                                                    key={mode}
                                                    type="button"
                                                    onClick={() => {
                                                        setRouteType(mode);
                                                        setAddForm({ from: [], to: [] });
                                                        setSelectedPincodeIds([]);
                                                        setSelectedZoneState(null);
                                                    }}
                                                    className={`flex-1 py-2.5 rounded-lg font-bold uppercase text-[10px] tracking-widest transition-all ${routeType === mode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {routeType === 'CORRIDOR' ? (
                                        <div className="space-y-6 mt-2">
                                            {/* Route Name for Corridor */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Corridor Label (Optional)</label>
                                                <input 
                                                    type="text"
                                                    value={routeName}
                                                    onChange={(e) => setRouteName(e.target.value)}
                                                    placeholder="e.g. Delhi - Kerala Express"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-shadow text-sm"
                                                />
                                            </div>

                                            {/* Dynamic Stops List */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Stops</label>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setCorridorStops(prev => [...prev, { id: Date.now(), pincode: null, pincodeId: null, pickupPoint: true, dropPoint: true }])}
                                                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-800 transition-colors shadow-sm"
                                                    >
                                                        <Plus size={12} /> Add Stop
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    {corridorStops.map((stop, idx) => (
                                                        <div key={stop.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3 relative group/stop transition-all hover:border-slate-300">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                                                    {idx + 1}
                                                                </div>
                                                                <div 
                                                                    onClick={() => {
                                                                        setActiveStopIndex(idx);
                                                                        setPickerState({ active: 'corridor', step: 'states', searchQuery: '' });
                                                                    }}
                                                                    className={`flex-1 px-4 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between
                                                                        ${stop.pincode ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-white border-dashed border-slate-300 text-slate-400'}`}
                                                                >
                                                                    {stop.pincode || "Click to select Location..."}
                                                                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                                                                        <MapPin size={12} />
                                                                    </div>
                                                                </div>
                                                                
                                                                {corridorStops.length > 2 && (
                                                                    <button 
                                                                        type="button"
                                                                        onClick={() => setCorridorStops(prev => prev.filter((_, i) => i !== idx))}
                                                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                )}
                                                            </div>

                                                            <div className="flex gap-6 pl-11">
                                                                <label className="flex items-center gap-2.5 cursor-pointer group/node">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={stop.pickupPoint}
                                                                        onChange={(e) => {
                                                                            const updated = [...corridorStops];
                                                                            updated[idx].pickupPoint = e.target.checked;
                                                                            setCorridorStops(updated);
                                                                        }}
                                                                        className="hidden"
                                                                    />
                                                                    <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all ${stop.pickupPoint ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                                                        {stop.pickupPoint && <Check size={10} className="text-white" />}
                                                                    </div>
                                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stop.pickupPoint ? 'text-slate-900' : 'text-slate-400'}`}>Pickup Point</span>
                                                                </label>

                                                                <label className="flex items-center gap-2.5 cursor-pointer group/node">
                                                                    <input 
                                                                        type="checkbox" 
                                                                        checked={stop.dropPoint}
                                                                        onChange={(e) => {
                                                                            const updated = [...corridorStops];
                                                                            updated[idx].dropPoint = e.target.checked;
                                                                            setCorridorStops(updated);
                                                                        }}
                                                                        className="hidden"
                                                                    />
                                                                    <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all ${stop.dropPoint ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                                                        {stop.dropPoint && <Check size={10} className="text-white" />}
                                                                    </div>
                                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stop.dropPoint ? 'text-slate-900' : 'text-slate-400'}`}>Drop Point</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 mt-2">
                                            {/* Zone Name */}
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Zone Label</label>
                                                <input 
                                                    type="text"
                                                    value={routeName}
                                                    onChange={(e) => setRouteName(e.target.value)}
                                                    placeholder="e.g. Delhi NCR Zone"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-shadow text-sm"
                                                />
                                            </div>

                                            {/* Zone Hub Selection */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Regional HUB (State)</label>
                                                    {selectedPincodeIds.length > 0 && (
                                                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{selectedPincodeIds.length} PINCODES ACTIVE</span>
                                                    )}
                                                </div>
                                                <div
                                                    onClick={() => setPickerState({ active: 'origin', step: 'states', searchQuery: '' })}
                                                    className={`w-full p-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all hover:shadow-sm
                                                        ${pickerState.active === 'origin' ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                                            <Globe size={18} />
                                                        </div>
                                                        <div>
                                                            <span className={`text-sm font-bold block ${selectedZoneState ? 'text-slate-900' : 'text-slate-400'}`}>
                                                                {selectedZoneState ? selectedZoneState.stateName : 'Select Operation HUB...'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{selectedZoneState ? 'Hub Selected' : 'Required'}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={18} className="text-slate-300" />
                                                </div>
                                            </div>

                                            {isFetchingZoneData && (
                                                <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl animate-pulse">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Compiling Zone Pincodes...</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </form>
                                
                                <div className="pt-4 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        onClick={handleAddRoute}
                                        disabled={isAdding || !selectedFleetId}
                                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs tracking-[0.2em] shadow-lg shadow-slate-200 disabled:opacity-50 hover:bg-black transition-all flex items-center justify-center gap-3"
                                    >
                                        {isAdding ? <Loader2 size={16} className="animate-spin" /> : (editingRouteId ? <Edit2 size={16} /> : <Plus size={16} />)}
                                        {isAdding ? (editingRouteId ? 'UPDATING ROUTE...' : 'PROVISIONING ROUTE...') : (editingRouteId ? 'UPDATE ROUTE' : 'CONFIRM ROUTE')}
                                    </button>
                                </div>
                            </div>

                            {/* Cascading Picker Side */}
                            <div className="w-full md:w-[360px] bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col relative" ref={pickerRef}>
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
                                            <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center shadow-sm">
                                                        {pickerState.step === 'states' && <Globe size={18} />}
                                                        {pickerState.step === 'cities' && <LocateFixed size={18} />}
                                                        {pickerState.step === 'pincodes' && <MapPin size={18} />}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-slate-900">
                                                            {pickerState.step === 'states' ? 'Select State' :
                                                                pickerState.step === 'cities' ? 'Select City' : 'Select Pincode'}
                                                        </h3>
                                                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                                                            {pickerState.step === 'cities' ? pickerState.selectedState?.stateName :
                                                                pickerState.step === 'pincodes' ? pickerState.selectedCity?.cityName : 'India Regions'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative">
                                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder={`Search ${pickerState.step}...`}
                                                        value={pickerState.searchQuery}
                                                        onChange={(e) => setPickerState(prev => ({ ...prev, searchQuery: e.target.value }))}
                                                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10 transition-all shadow-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* List Content */}
                                            <div className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar">
                                                {fetchingStatus[pickerState.step] ? (
                                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                                                        <Loader2 size={28} className="animate-spin text-slate-300" />
                                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading data...</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-2.5 pb-24">
                                                        {pickerState.step === 'states' && locations.states
                                                            .filter(s => s.stateName.toLowerCase().includes(pickerState.searchQuery.toLowerCase()))
                                                            .map(state => (
                                                                <button
                                                                    key={state.id}
                                                                    onClick={() => handleLocationClick('state', state)}
                                                                    className="w-full p-4 flex items-center justify-between bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all group"
                                                                >
                                                                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{state.stateName}</span>
                                                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
                                                                </button>
                                                            ))}

                                                        {pickerState.step === 'cities' && locations.cities
                                                            .filter(c => c.cityName.toLowerCase().includes(pickerState.searchQuery.toLowerCase()))
                                                            .map(city => (
                                                                <CityListItem 
                                                                    key={city.id}
                                                                    city={city}
                                                                    isZoneMode={routeType === 'ZONE'}
                                                                    selectedPincodeIds={selectedPincodeIds}
                                                                    onClick={(c) => handleLocationClick('city', c)}
                                                                    onToggle={async (c) => {
                                                                        try {
                                                                            const res = await fetch(`https://dev.amankumarr.in/api/location/cities/${c.id}/pincodes`);
                                                                            const data = await res.json();
                                                                            if (data.success) {
                                                                                const cityPincodeIds = data.data.map(p => p.id);
                                                                                const allPresent = cityPincodeIds.every(id => selectedPincodeIds.includes(id));
                                                                                if (allPresent) {
                                                                                    setSelectedPincodeIds(prev => prev.filter(id => !cityPincodeIds.includes(id)));
                                                                                } else {
                                                                                    setSelectedPincodeIds(prev => [...new Set([...prev, ...cityPincodeIds])]);
                                                                                }
                                                                            }
                                                                        } catch (err) { console.error(err); }
                                                                    }}
                                                                />
                                                            ))}

                                                        {pickerState.step === 'pincodes' && locations.pincodes
                                                            .filter(p => p.pincode.includes(pickerState.searchQuery))
                                                            .map(pin => {
                                                                const displayValue = `${pickerState.selectedCity.cityName} - ${pin.pincode}`;
                                                                const isSelected = routeType === 'ZONE' 
                                                                    ? selectedPincodeIds.includes(pin.id)
                                                                    : addForm[pickerState.active]?.includes(displayValue);
                                                                return (
                                                                    <button
                                                                        key={pin.id}
                                                                        type="button"
                                                                        onClick={() => handleLocationClick('pincode', pin)}
                                                                        className={`w-full p-3.5 flex items-center justify-between rounded-xl transition-all border 
                                                                            ${isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-sm'}`}
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            <MapPin size={16} className={isSelected ? 'text-slate-300' : 'text-slate-400'} />
                                                                            <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>{pin.pincode}</span>
                                                                        </div>
                                                                        {isSelected && <Check size={18} className="text-white" />}
                                                                    </button>
                                                                );
                                                            })}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Footer */}
                                            <div className="p-5 border-t border-slate-200 bg-white/90 backdrop-blur-md absolute bottom-0 left-0 right-0 z-20 space-y-2.5">
                                                {(routeType === 'ZONE' ? selectedPincodeIds.length > 0 : corridorStops.some(s => s.pincodeId)) && (
                                                    <button
                                                        onClick={closePicker}
                                                        className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg"
                                                    >
                                                        Done ({routeType === 'ZONE' ? selectedPincodeIds.length : corridorStops.filter(s => s.pincodeId).length} selected)
                                                    </button>
                                                )}
                                                
                                                {pickerState.step === 'pincodes' && routeType === 'ZONE' && (
                                                    <button
                                                        onClick={() => {
                                                            const allPincodeIds = locations.pincodes.map(p => p.id);
                                                            const allSelected = allPincodeIds.every(id => selectedPincodeIds.includes(id));
                                                            if (allSelected) {
                                                                setSelectedPincodeIds(prev => prev.filter(id => !allPincodeIds.includes(id)));
                                                            } else {
                                                                setSelectedPincodeIds(prev => [...new Set([...prev, ...allPincodeIds])]);
                                                            }
                                                        }}
                                                        className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors shadow-sm"
                                                    >
                                                        {locations.pincodes.every(p => selectedPincodeIds.includes(p.id)) ? 'Deselect All in City' : 'Select All in City'}
                                                    </button>
                                                )}

                                                {pickerState.step !== 'states' && (
                                                    <button
                                                        onClick={() => setPickerState(prev => ({
                                                            ...prev,
                                                            step: prev.step === 'pincodes' ? 'cities' : 'states'
                                                        }))}
                                                        className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <ArrowRight size={14} className="rotate-180" />
                                                        Back
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50">
                                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-5 shadow-sm rotate-3 hover:rotate-0 transition-transform">
                                                <MapPin size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 tracking-wide">Select an input to <br /> browse locations</p>
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