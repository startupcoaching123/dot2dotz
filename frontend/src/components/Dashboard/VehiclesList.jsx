import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Search, MapPin, X, MoreVertical, Plus, Hash, Fuel, Weight, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { AUTH_ENDPOINTS, API_BASE_URL } from '../../api/endpoints';
import fetchWithAuth from '../../FetchWithAuth';

const VehiclesList = ({ vendorId, title = "Fleet Vehicles", refreshTrigger = 0 }) => {
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
            console.log(res);
            const data = await res.json();
            console.log(data);
            if (res.ok) {
                Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: `${vehicleCount} vehicle(s) added successfully`, showConfirmButton: false, timer: 3000 });
                setShowAddModal(false);
                setSelectedVehicleId('');
                setVehicleCount(1);
                fetchVehicles();
            } else {
                let errorTitle = 'Failed to add vehicle';
                try {
                    const data = await res.json();
                    errorTitle = data.message || data.error || `Server responded with ${res.status}`;
                } catch {
                    errorTitle = `Server error ${res.status}`;
                }
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

    const getVehicleId = (v) => v?.vehicle_id || v?.vehicleId || v?.vendorVehiclesId || v?._id || v?.id;

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
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                            <span className="w-1.5 h-6 bg-orange-600 rounded-full"></span>
                            {title}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mt-1">Total {vehicles.length} Vehicles</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-600 transition-all"
                            />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-orange-700 transition-all shadow-sm"
                        >
                            <Plus size={14} />
                            Add Vehicle
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Loading Fleet...</p>
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck size={32} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase text-xs">No vehicles found</p>
                            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mt-2">Add your first vehicle to get started</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Vehicle Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Loading Specs</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Fleet Deployment</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredVehicles.map((vehicle, idx) => (
                                    <tr
                                        key={getVehicleId(vehicle) || idx}
                                        onClick={() => handleVehicleClick(vehicle)}
                                        className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 rounded-[1.25rem] flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    <Truck size={26} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 group-hover:text-orange-600 transition-colors uppercase italic tracking-tighter text-base">
                                                        {vehicle.vehicle || vehicle.vehicleNumber || vehicle.vehicle_number ||
                                                            vehicle.vehicle?.vehicleNumber || vehicle.vehicle?.vehicle_number ||
                                                            (vehicle.vehicle?.brand ? `${vehicle.vehicle.brand} ${vehicle.vehicle.model || ''}` : '') ||
                                                            vehicle.vehicle?.name || vehicle.name || 'Vehicle Ref'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref ID: {getVehicleId(vehicle) || `VH-${100 + idx}`}</p>
                                                        {(vehicle.brand || vehicle.vehicle?.brand) && (
                                                            <>
                                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                                <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{vehicle.brand || vehicle.vehicle?.brand} {vehicle.model || vehicle.vehicle?.model}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-wider">
                                                        {vehicle.vehicleType || 'General'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                                                        <Weight size={14} className="text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Load</p>
                                                        <p className="text-xs font-black text-slate-900 italic lowercase tracking-tight">
                                                            {vehicle.maxLoadCapacityKg || vehicle.capacity || '---'} KG
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3 group/item">
                                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover/item:bg-orange-600 transition-colors">
                                                        <Hash size={14} className="text-slate-400 group-hover/item:text-white transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Fleet</p>
                                                        <p className="text-sm font-black text-slate-900 italic">{vehicle.numberOfVehicles || 0} Units</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 group/item">
                                                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover/item:bg-slate-900 transition-colors">
                                                        <Fuel size={14} className="text-slate-400 group-hover/item:text-white transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</p>
                                                        <p className="text-xs font-black text-slate-700 uppercase">{vehicle.noOfWheels || '---'} Wheels</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${vehicle.active === false ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                                {vehicle.active === false ? 'Out of Service' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-slate-50 text-slate-300 hover:text-orange-600 hover:bg-orange-50 rounded-2xl transition-all border border-transparent hover:border-orange-100">
                                                <MoreVertical size={18} />
                                            </button>
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                    >
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">Add to Fleet</h1>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 text-orange-600">Global Vehicle Catalog</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-3 bg-white text-slate-400 rounded-2xl hover:text-red-500 hover:shadow-md transition-all border border-slate-100"><X size={20} /></button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name, type or body style..."
                                    value={catalogSearchTerm}
                                    onChange={(e) => setCatalogSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-orange-500 transition-all focus:bg-white"
                                />
                            </div>

                            {isLoadingAvailable ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-slate-400 font-black italic uppercase tracking-widest text-[10px]">Fetching Catalog...</p>
                                </div>
                            ) : filteredAvailableVehicles.length === 0 ? (
                                <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                    <Truck size={40} className="text-slate-200 mx-auto mb-4" />
                                    <p className="text-slate-400 font-black italic uppercase text-xs tracking-widest">No matching vehicles</p>
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
                                                className={`group p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${
                                                    isSelected 
                                                        ? 'border-orange-600 bg-orange-50/30' 
                                                        : 'border-slate-50 bg-white hover:border-slate-100 hover:bg-slate-50/50'
                                                }`}
                                            >
                                                <div className="flex items-start gap-6">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                                                        isSelected ? 'bg-orange-600 text-white shadow-xl shadow-orange-200' : 'bg-slate-100 text-slate-400 group-hover:scale-105'
                                                    }`}>
                                                        <Truck size={28} />
                                                    </div>
                                                    
                                                    <div className="flex-1 space-y-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-black text-slate-900 uppercase italic tracking-tighter text-lg">{v.vehicle || 'Unnamed Vehicle'}</h4>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{v.vehicleType || 'Standard'}</span>
                                                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.useType || 'Commercial'}</span>
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300 shadow-lg shadow-orange-200">
                                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                            <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                                                                <p className="text-xs font-black text-slate-700">{v.maxLoadCapacityKg ? `${v.maxLoadCapacityKg} KG` : '---'}</p>
                                                            </div>
                                                            <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Body Type</p>
                                                                <p className="text-xs font-black text-slate-700 uppercase truncate">{v.vehicleBodyType || '---'}</p>
                                                            </div>
                                                            <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Wheels</p>
                                                                <p className="text-xs font-black text-slate-700">{v.noOfWheels || '---'}</p>
                                                            </div>
                                                            <div className="bg-white/50 p-2.5 rounded-xl border border-slate-100/50">
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Dim (LxWxH)</p>
                                                                <p className="text-xs font-black text-slate-700">{v.length && v.width ? `${v.length}x${v.width}x${v.height || '0'}` : 'N/A'}</p>
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
                            <div className="p-8 border-t border-slate-50 bg-slate-50/50">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                                            <button
                                                type="button"
                                                onClick={() => setVehicleCount(prev => Math.max(1, prev - 1))}
                                                className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl font-black text-xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                            >
                                                −
                                            </button>
                                            <div className="flex-1 text-center">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Deploy Count</p>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={vehicleCount}
                                                    onChange={(e) => setVehicleCount(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-full text-center bg-transparent font-black text-lg text-slate-900 outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setVehicleCount(prev => prev + 1)}
                                                className="w-12 h-12 bg-slate-50 text-slate-900 rounded-xl font-black text-xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddVehicle}
                                        disabled={isAdding}
                                        className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                                    >
                                        {isAdding ? 'Adding...' : `Deploy ${vehicleCount} Vehicle${vehicleCount > 1 ? 's' : ''}`}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
                )}
            </AnimatePresence>

            {/* Vehicle Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedDetailVehicle && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-orange-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-orange-100">
                                    <Truck size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">
                                        {selectedDetailVehicle.vehicleNumber || selectedDetailVehicle.vehicle_number || 'Vehicle Details'}
                                    </h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Status: {selectedDetailVehicle.active !== false ? 'Active' : 'Out of Service'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="p-3 bg-white text-slate-400 rounded-2xl hover:text-red-500 hover:shadow-md transition-all border border-slate-100"><X size={20} /></button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                            {isFetchingDetail ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-4">
                                    <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-slate-400 font-black italic uppercase tracking-widest text-[10px]">Syncing with Cloud API...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-6">
                                    {Object.entries(selectedDetailVehicle)
                                        .filter(([key, val]) =>
                                            val !== null &&
                                            val !== undefined &&
                                            val !== '' &&
                                            !['__v', 'createdAt', 'updatedAt', 'id', '_id', 'vehicleId', 'vehicle_id', 'vendorId'].includes(key) &&
                                            typeof val !== 'object'
                                        )
                                        .map(([key, val]) => (
                                            <div key={key} className="bg-slate-50 p-5 rounded-3xl border border-slate-100 hover:border-orange-200 transition-all hover:bg-white hover:shadow-lg hover:shadow-slate-100 group">
                                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em] mb-1.5 group-hover:text-orange-500 transition-colors">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                                                </p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic">
                                                    {String(val)}
                                                </p>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
            </AnimatePresence>
        </div>
    );
};

export default VehiclesList;
