import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Search, MapPin, X, MoreVertical, Plus, Hash, Fuel, Weight, Calendar, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const VehiclesList = ({ vendorId, title = "Fleet Vehicles", refreshTrigger = 0, onUpdate }) => {
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [catalogSearchTerm, setCatalogSearchTerm] = useState('');

    // Add Vehicle Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');
    const [vehicleCount, setVehicleCount] = useState(1);
    // Bulk Registration State
const [bulkRegistrationMode, setBulkRegistrationMode] = useState(false);

    // Available vehicles from /api/vehicles
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);

    // Vehicle Registration Modal State
    const [showRegModal, setShowRegModal] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [regFormData, setRegFormData] = useState({
        regNo: '',
        regDoc: null,
        otherDoc: null
    });
    const [activeRegVehicle, setActiveRegVehicle] = useState(null);
    const [registrations, setRegistrations] = useState([]); // Store registration details

    // Detailed Vehicle Modal
    const [selectedDetailVehicle, setSelectedDetailVehicle] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(false);

    const fetchVehicles = async () => {
        if (!vendorId) return;
        setIsLoading(true);
        setError('');
        try {
            // GET /api/vendors/:vendorId/fleet
            const url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet`;
            const res = await fetchWithAuth(url, { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch vehicles');
            const data = await res.json();

            const vehicleList = data.data || data.vehicles || data.fleet || data;
            setVehicles(Array.isArray(vehicleList) ? vehicleList : []);

            // Fetch registrations for this vendor
            const regUrl = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/registrations-all`; // Fallback to list all regs
            try {
                // Try specific endpoint if it exists or use the one from request
                const regRes = await fetchWithAuth(`${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/0/registrations`, { method: 'GET' });
                if (regRes.ok) {
                    const regData = await regRes.json();
                    setRegistrations(regData.data || []);
                }
            } catch (e) {
                console.error("Error fetching registrations:", e);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [vendorId, refreshTrigger]);

    // Fetch all available vehicles from /api/vehicles
    const fetchAvailableVehicles = async () => {
        setIsLoadingAvailable(true);
        try {
            const res = await fetchWithAuth(AUTH_ENDPOINTS.VEHICLES, { method: 'GET' });
            if (!res.ok) throw new Error('Failed to fetch available vehicles');
            const data = await res.json();
            const list = data.data || data.vehicles || data;
            setAvailableVehicles(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Error fetching available vehicles:', err);
            setAvailableVehicles([]);
        } finally {
            setIsLoadingAvailable(false);
        }
    };

    const openAddModal = () => {
        setShowAddModal(true);
        setSelectedVehicleId('');
        setVehicleCount(1);
        fetchAvailableVehicles();
    };

    const getAvailableVehicleId = (v) => v?.vehicle_id || v?.vehicleId || v?._id || v?.id;
    const getAvailableVehicleName = (v) => {
        const num = v?.vehicleNumber || v?.vehicle_number || v?.name || '';
        const type = v?.vehicleType || v?.vehicle_type || '';
        const cap = v?.capacity || '';
        return `${num}${type ? ' — ' + type : ''}${cap ? ' (' + cap + ')' : ''}`;
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        if (!selectedVehicleId) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Please select a vehicle', showConfirmButton: false, timer: 2000 });
            return;
        }
        if (vehicleCount < 1) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Count must be at least 1', showConfirmButton: false, timer: 2000 });
            return;
        }
        setIsAdding(true);
        try {
            // POST /api/vendors/:vendorId/fleet?vehicleId=1&count=5
            const url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet?vehicleId=${selectedVehicleId}&count=${vehicleCount}`;

            const res = await fetchWithAuth(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `${vehicleCount} vehicle(s) added successfully`, showConfirmButton: false, timer: 3000 });
                setShowAddModal(false);
                setSelectedVehicleId('');
                setVehicleCount(1);
                fetchVehicles();
                if (onUpdate) onUpdate();
            } else {
                const errorTitle = data.message || data.error || `Server responded with ${res.status}`;
                throw new Error(errorTitle);
            }
        } catch (err) {
            console.error("VEHICLE ADD ERROR:", err);
            Swal.fire({ icon: 'error', title: 'Vehicle Registration Failed', text: err.message });
        } finally {
            setIsAdding(false);
        }
    };

    const filteredVehicles = vehicles.filter(v =>
        (v.vehicle?.toLowerCase() || v.vehicleNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (v.vehicleType?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredAvailableVehicles = availableVehicles.filter(v =>
        (v.vehicle?.toLowerCase() || '').includes(catalogSearchTerm.toLowerCase()) ||
        (v.vehicleType?.toLowerCase() || '').includes(catalogSearchTerm.toLowerCase()) ||
        (v.vehicleBodyType?.toLowerCase() || '').includes(catalogSearchTerm.toLowerCase())
    );

    const getVehicleId = (v) => v?.vendorVehiclesId;

    const handleRegisterClick = (e, vehicle) => {
        e.stopPropagation();
        setActiveRegVehicle(vehicle);
        setRegFormData({ regNo: '', regDoc: null, otherDoc: null });
        setShowRegModal(true);
    };

    const handleRegSubmit = async (e) => {
        e.preventDefault();
        const vId = getVehicleId(activeRegVehicle);
        if (!vId || !vendorId) return;

        if (!regFormData.regNo) {
            Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'Registration number is required', showConfirmButton: false, timer: 2000 });
            return;
        }

        setIsRegistering(true);
        try {
            const formData = new FormData();
            formData.append('regNo', regFormData.regNo);
            if (regFormData.regDoc) formData.append('regDoc', regFormData.regDoc);
            if (regFormData.otherDoc) formData.append('otherDoc', regFormData.otherDoc);

            const url = `${AUTH_ENDPOINTS.GET_VENDORS}/${vendorId}/fleet/${vId}/registrations`;
            const res = await fetchWithAuth(url, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                console.log("REGISTRATION RESPONSE:", data);
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Registration added successfully', showConfirmButton: false, timer: 3000 });
                setShowRegModal(false);
                fetchVehicles(); // Re-fetch to update the registration count
            } else {
                let errorMsg = 'Registration failed';
                try {
                    const data = await res.json();
                    errorMsg = data.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: err.message });
        } finally {
            setIsRegistering(false);
        }
    };

    const handleVehicleClick = async (vehicle) => {
        const vId = getVehicleId(vehicle);
        if (!vId) return;

        setIsFetchingDetail(true);
        setSelectedDetailVehicle(vehicle); // Show local data first
        setShowDetailModal(true);

        try {
            // Try to fetch full details from global vehicles API
            const res = await fetchWithAuth(`${AUTH_ENDPOINTS.VEHICLES}/${vId}`, { method: 'GET' });
            if (res.ok) {
                const data = await res.json();
                const detailed = data.data || data.vehicle || data;
                setSelectedDetailVehicle({ ...vehicle, ...detailed });
            }
        } catch (err) {
            console.error("Error fetching vehicle details:", err);
        } finally {
            setIsFetchingDetail(false);
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-200 focus:border-gray-900 rounded-lg text-sm font-medium transition-all outline-none shadow-sm placeholder:text-gray-400";
    const labelClasses = "block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1";

    return (
        <div className="space-y-6 text-gray-900">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">
                        {title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{vehicles.length} units currently in fleet</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search fleet..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-all placeholder:text-gray-400 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm flex-shrink-0"
                    >
                        <Plus size={16} />
                        Add Vehicle
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-gray-900">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest leading-none">Scanning fleet...</p>
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-xl border border-gray-100 flex items-center justify-center mx-auto mb-3">
                                <Truck size={24} />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">No vehicles discovered in fleet</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/10">
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Vehicle Identity</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Specs</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deployment</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVehicles.map((vehicle, idx) => {
                                    const vId = getVehicleId(vehicle);
                                    
                                    // 1. Find ALL registrations for this specific fleet item
                                    const fleetRegistrations = registrations.filter(r => r.vehicleId === vId);
                                    
                                    // 2. Get the total required registrations
                                    const totalCount = vehicle.numberOfVehicles || 1;
                                    
                                    // 3. Check if we have registered all of them
                                    const isFullyRegistered = fleetRegistrations.length >= totalCount;

                                    return (
                                        <tr
                                            key={vId || idx}
                                            onClick={() => handleVehicleClick(vehicle)}
                                            className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-50 border border-gray-100 text-gray-500 rounded-lg flex items-center justify-center shadow-sm group-hover:border-gray-300 transition-colors">
                                                        <Truck size={20} strokeWidth={1.5} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                                                            {vehicle.vehicle || vehicle.vehicleNumber || vehicle.vehicle_number ||
                                                                vehicle.vehicle?.vehicleNumber || vehicle.vehicle?.vehicle_number ||
                                                                (vehicle.vehicle?.brand ? `${vehicle.vehicle.brand} ${vehicle.vehicle.model || ''}` : '') ||
                                                                vehicle.vehicle?.name || 'Incomplete Profile'}
                                                        </p>
                                                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                            <p className="text-[11px] text-gray-400 font-medium">ID: {vId || `V-${1000 + idx}`}</p>
                                                            
                                                            {fleetRegistrations.length > 0 && (
                                                                <>
                                                                    <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                                                                    {fleetRegistrations.map((reg, i) => (
                                                                        <span key={i} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-tight">
                                                                            {reg.regNo}
                                                                        </span>
                                                                    ))}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-semibold text-gray-800 uppercase tracking-tight">
                                                        {vehicle.vehicleType || 'Utility'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 font-medium italic">
                                                        Capacity: {vehicle.maxLoadCapacityKg || vehicle.capacity || '--'} KG
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-semibold text-gray-800">{totalCount} Units</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mt-0.5">Deployed Fleet</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {(() => {
                                                    const isMaintenance = vehicle.active === false;

                                                    if (isMaintenance) {
                                                        return (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-100 uppercase">
                                                                Maintenance
                                                            </span>
                                                        );
                                                    }

                                                    if (!isFullyRegistered) {
                                                        return (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                                                                Pending Reg {totalCount > 1 ? `(${fleetRegistrations.length}/${totalCount})` : ''}
                                                            </span>
                                                        );
                                                    }

                                                    return (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 uppercase">
                                                            Active
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-1.5">
                                                    {!isFullyRegistered && (
                                                        <button
                                                            onClick={(e) => handleRegisterClick(e, vehicle)}
                                                            className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-[10px] font-bold uppercase tracking-tight hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap"
                                                        >
                                                            Register {totalCount > 1 ? `(${fleetRegistrations.length + 1})` : ''}
                                                        </button>
                                                    )}
                                                    <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Vehicle Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6 text-gray-900">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-100"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">Expand Fleet</h2>
                                    <p className="text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wider italic">Vehicle Catalog Selection</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><X size={18} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-white">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Search by brand, type or body style..."
                                        value={catalogSearchTerm}
                                        onChange={(e) => setCatalogSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50/30 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 transition-all font-medium"
                                    />
                                </div>

                                {isLoadingAvailable ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-3 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none italic">Accessing database...</p>
                                    </div>
                                ) : filteredAvailableVehicles.length === 0 ? (
                                    <div className="py-20 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                        <Truck size={24} className="text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">No catalog matches discovered</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredAvailableVehicles.map((v, idx) => {
                                            const vId = String(getAvailableVehicleId(v) || idx);
                                            const isSelected = selectedVehicleId === vId;

                                            return (
                                                <div
                                                    key={vId}
                                                    onClick={() => setSelectedVehicleId(vId)}
                                                    className={`group p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                                                        ? 'border-gray-900 bg-gray-50/50 shadow-sm'
                                                        : 'border-gray-50 bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'
                                                            }`}>
                                                            <Truck size={24} strokeWidth={1.5} />
                                                        </div>

                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-gray-900 text-base leading-tight uppercase tracking-tight">{v.vehicle || 'Unknown Model'}</h4>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 uppercase italic tracking-tighter">{v.vehicleType || 'Utility'}</span>
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.vehicleBodyType || 'Standard'}</span>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                                                                        <Check size={14} strokeWidth={3} />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-3 gap-3 mt-3">
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Capacity</p>
                                                                    <p className="text-xs font-bold text-gray-900 italic leading-none">{v.maxLoadCapacityKg ? `${v.maxLoadCapacityKg} KG` : '--'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Wheels</p>
                                                                    <p className="text-xs font-bold text-gray-900 leading-none">{v.noOfWheels || '--'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Configuration</p>
                                                                    <p className="text-xs font-bold text-gray-900 leading-none truncate">{v.useType || 'Commercial'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {selectedVehicleId && (
                                <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 shadow-sm">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => setVehicleCount(prev => Math.max(1, prev - 1))}
                                                className="w-8 h-8 bg-gray-50 text-gray-600 rounded flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                            </button>
                                            <div className="flex flex-col items-center">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">QTY</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={vehicleCount}
                                                    onChange={(e) => setVehicleCount(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-10 text-center bg-transparent font-bold text-sm text-gray-900 outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVehicleCount(prev => prev + 1)}
                                                className="w-8 h-8 bg-gray-50 text-gray-600 rounded flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAddVehicle}
                                            disabled={isAdding}
                                            className="w-full sm:w-auto px-8 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-sm hover:hover:bg-black transition-all shadow-lg shadow-gray-200 disabled:opacity-50 whitespace-nowrap uppercase tracking-wider italic"
                                        >
                                            {isAdding ? 'Adding...' : `Authorize Deployment`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDetailModal && selectedDetailVehicle && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-100"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Truck size={24} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                                            {selectedDetailVehicle.vehicleNumber || selectedDetailVehicle.vehicle_number || 'Vehicle Details'}
                                        </h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`w-2 h-2 rounded-full ${selectedDetailVehicle.active !== false ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                            <p className="text-sm font-medium text-gray-500">{selectedDetailVehicle.active !== false ? 'Active' : 'Out of Service'}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} strokeWidth={1.5} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50/30">
                                {isFetchingDetail ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm font-medium text-gray-500">Syncing Details...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(selectedDetailVehicle)
                                            .filter(([key, val]) =>
                                                val !== null &&
                                                val !== undefined &&
                                                val !== '' &&
                                                !['__v', 'createdAt', 'updatedAt', 'id', '_id', 'vehicleId', 'vehicle_id', 'vendorId'].includes(key) &&
                                                typeof val !== 'object'
                                            )
                                            .map(([key, val]) => (
                                                <div key={key} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all group">
                                                    <p className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1 group-hover:text-blue-500 transition-colors">
                                                        {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-900 break-words group-hover:text-blue-900 transition-colors">
                                                        {String(val)}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-white">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors shadow-sm"
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Vehicle Registration Modal */}
            <AnimatePresence>
                {showRegModal && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                                        {bulkRegistrationMode ? `Bulk Vehicle Registration (${bulkRegData.length} vehicles)` : 'Vehicle Registration'}
                                    </h2>
                                    <p className="text-sm font-medium text-gray-500 mt-1">
                                        {activeRegVehicle?.vehicle || activeRegVehicle?.vehicleNumber || 'Add Registration Details'}
                                        {(() => {
                                            if (!activeRegVehicle) return null;
                                            const activeTotal = activeRegVehicle.numberOfVehicles || 1;
                                            if (activeTotal <= 1) return null;
                                            const currentRegs = registrations.filter(r => r.vehicleId === getVehicleId(activeRegVehicle)).length;
                                            return <span className="ml-1 font-bold text-blue-600">(Doc {currentRegs + 1} of {activeTotal})</span>;
                                        })()}
                                    </p>
                                </div>
                                <button onClick={() => setShowRegModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
                                    <X size={20} strokeWidth={1.5} />
                                </button>
                            </div>

                            <form onSubmit={handleRegSubmit} className="p-6 space-y-5 bg-gray-50/30">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 uppercase italic">Registration Number</label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. GJ01AB1234"
                                            value={regFormData.regNo}
                                            onChange={(e) => setRegFormData({ ...regFormData, regNo: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 uppercase italic">RC Document (PDF)</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setRegFormData({ ...regFormData, regDoc: e.target.files[0] })}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] ml-1 uppercase italic">Other Document (PDF)</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => setRegFormData({ ...regFormData, otherDoc: e.target.files[0] })}
                                            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowRegModal(false)}
                                        className="flex-1 py-3 bg-white text-gray-700 rounded-xl font-bold italic uppercase tracking-widest text-[10px] border border-gray-200 hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isRegistering}
                                        className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-black italic uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isRegistering ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : 'Submit Registration'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VehiclesList;