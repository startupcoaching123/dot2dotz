import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Search, MapPin, X, MoreVertical, Plus, Hash, Fuel, Weight, Calendar } from 'lucide-react';
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
    const [registrations, setRegistrations] = useState([]); // Added to store registration details

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
                fetchVehicles();
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">Managing {vehicles.length} total vehicles</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-grow sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search vehicles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 focus:bg-white transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-black transition-all shadow-sm flex-shrink-0"
                    >
                        <Plus size={16} />
                        Add Vehicle
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-gray-500">Loading Fleet...</p>
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="py-28 text-center">
                            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Truck size={32} />
                            </div>
                            <p className="text-base font-semibold text-gray-900">No vehicles found</p>
                            <p className="text-sm text-gray-500 mt-1">Add your first vehicle to get started</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Vehicle Identity</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Loading Specs</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Deployed</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVehicles.map((vehicle, idx) => (
                                    <tr
                                        key={getVehicleId(vehicle) || idx}
                                        onClick={() => handleVehicleClick(vehicle)}
                                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 border border-gray-100 text-gray-600 rounded-xl flex items-center justify-center shadow-sm group-hover:border-gray-300 transition-colors">
                                                    <Truck size={24} strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                                                        {vehicle.vehicle || vehicle.vehicleNumber || vehicle.vehicle_number ||
                                                            vehicle.vehicle?.vehicleNumber || vehicle.vehicle?.vehicle_number ||
                                                            (vehicle.vehicle?.brand ? `${vehicle.vehicle.brand} ${vehicle.vehicle.model || ''}` : '') ||
                                                            vehicle.vehicle?.name || vehicle.name || 'Vehicle Ref'}
                                                    </p>
                                                    {registrations.find(r => r.vehicleId === getVehicleId(vehicle)) && (
                                                        <div className="mt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 shadow-sm">
                                                                <Hash size={10} className="text-emerald-500" />
                                                                <span className="text-[10px] font-black uppercase italic tracking-wider">
                                                                    {registrations.find(r => r.vehicleId === getVehicleId(vehicle)).regNo}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <p className="text-xs text-gray-500 font-medium tracking-wide">Ref ID: {getVehicleId(vehicle) || `VH-${100 + idx}`}</p>
                                                        {(vehicle.brand || vehicle.vehicle?.brand) && (
                                                            <>
                                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                                <p className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">{vehicle.brand || vehicle.vehicle?.brand} {vehicle.model || vehicle.vehicle?.model}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                                                        {vehicle.vehicleType || 'General'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                                                        <Weight size={14} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-900 leading-none">
                                                            {vehicle.maxLoadCapacityKg || vehicle.capacity || '---'} KG
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 uppercase mt-0.5 tracking-wider font-medium">Max Load</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-2.5 group/item">
                                                    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                                                        <Hash size={14} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-900 leading-none">{vehicle.numberOfVehicles || 0} Units</p>
                                                        <p className="text-[10px] text-gray-400 uppercase mt-0.5 tracking-wider font-medium">Deployed</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2.5 group/item">
                                                    <div className="w-7 h-7 bg-gray-50 border border-gray-100 rounded flex items-center justify-center">
                                                        <Fuel size={14} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-medium text-gray-700 leading-none">{vehicle.noOfWheels || '---'} Wheels</p>
                                                        <p className="text-[10px] text-gray-400 uppercase mt-0.5 tracking-wider font-medium">Config</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 align-top">
                                            {(() => {
                                                const hasRegistration = registrations.some(r => r.vehicleId === getVehicleId(vehicle));
                                                const isMaintenance = vehicle.active === false;

                                                if (isMaintenance) {
                                                    return (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-rose-50 text-rose-700 border-rose-200/60 uppercase tracking-tighter italic">
                                                            Maintenance
                                                        </span>
                                                    );
                                                }

                                                if (!hasRegistration) {
                                                    return (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-orange-50 text-orange-700 border-orange-200/60 uppercase tracking-tighter italic">
                                                            Register & Activate
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/60 uppercase tracking-tighter italic">
                                                        Active
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-5 align-top text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {!registrations.some(r => r.vehicleId === getVehicleId(vehicle)) && (
                                                    <button
                                                        onClick={(e) => handleRegisterClick(e, vehicle)}
                                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Register
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Vehicle Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-gray-100"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Add to Fleet</h2>
                                    <p className="text-sm font-medium text-gray-500 mt-1">Select from the global vehicle catalog</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} strokeWidth={1.5} /></button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6 bg-gray-50/30">
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, type or body style..."
                                        value={catalogSearchTerm}
                                        onChange={(e) => setCatalogSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-sm"
                                    />
                                </div>

                                {isLoadingAvailable ? (
                                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                                        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-sm font-medium text-gray-500">Fetching Catalog...</p>
                                    </div>
                                ) : filteredAvailableVehicles.length === 0 ? (
                                    <div className="py-20 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                        <Truck size={32} className="text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                                        <p className="text-sm font-semibold text-gray-900">No matching vehicles</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredAvailableVehicles.map((v, idx) => {
                                            const vId = String(getAvailableVehicleId(v) || idx);
                                            const isSelected = selectedVehicleId === vId;

                                            return (
                                                <div
                                                    key={vId}
                                                    onClick={() => setSelectedVehicleId(vId)}
                                                    className={`group p-5 rounded-2xl border transition-all cursor-pointer ${isSelected
                                                        ? 'border-blue-500 bg-blue-50/40 shadow-md shadow-blue-500/10'
                                                        : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm hover:shadow-blue-500/5'
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-4 sm:gap-5">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isSelected ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 rotate-3' : 'bg-gray-50 border border-gray-100 text-gray-500 group-hover:scale-105'
                                                            }`}>
                                                            <Truck size={24} strokeWidth={1.5} />
                                                        </div>

                                                        <div className="flex-1 space-y-2.5">
                                                            <div className="flex justify-between items-start gap-2">
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 text-base">{v.vehicle || 'Unnamed Vehicle'}</h4>
                                                                    <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap overflow-hidden">
                                                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{v.vehicleType || 'Standard'}</span>
                                                                        <span className="w-1 h-1 bg-gray-300 rounded-full flex-shrink-0"></span>
                                                                        <span className="text-xs font-medium text-gray-500">{v.useType || 'Commercial'}</span>
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0 animate-in zoom-in duration-200">
                                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                                <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Capacity</p>
                                                                    <p className="text-xs font-semibold text-gray-900">{v.maxLoadCapacityKg ? `${v.maxLoadCapacityKg} KG` : '---'}</p>
                                                                </div>
                                                                <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Body Type</p>
                                                                    <p className="text-xs font-semibold text-gray-900 truncate">{v.vehicleBodyType || '---'}</p>
                                                                </div>
                                                                <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Wheels</p>
                                                                    <p className="text-xs font-semibold text-gray-900">{v.noOfWheels || '---'}</p>
                                                                </div>
                                                                <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-sm">
                                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Dim (LxWxH)</p>
                                                                    <p className="text-xs font-semibold text-gray-900">{v.length && v.width ? `${v.length}x${v.width}x${v.height || '0'}` : 'N/A'}</p>
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
                                <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex-1 w-full flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => setVehicleCount(prev => Math.max(1, prev - 1))}
                                                className="w-10 h-10 bg-white text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200 shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                                            </button>
                                            <div className="flex-1 text-center flex flex-col">
                                                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Count</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={vehicleCount}
                                                    onChange={(e) => setVehicleCount(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-full text-center bg-transparent font-semibold text-base text-gray-900 outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVehicleCount(prev => prev + 1)}
                                                className="w-10 h-10 bg-white text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center border border-gray-200 shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAddVehicle}
                                            disabled={isAdding}
                                            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {isAdding ? 'Deploying...' : `Deploy ${vehicleCount} Vehicle${vehicleCount > 1 ? 's' : ''}`}
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
                                    <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Vehicle Registration</h2>
                                    <p className="text-sm font-medium text-gray-500 mt-1">
                                        {activeRegVehicle?.vehicle || activeRegVehicle?.vehicleNumber || 'Add Registration Details'}
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
